import * as d3 from "d3";
import { useMemo, useRef } from "react";
import { useSpring, animated, to, easings, config } from "@react-spring/web";
import { data } from "./data.js";
import { useDimensions } from "./use-dimensions.js";
import styles from "./donut-chart.module.css";

interface ResponsiveDonutProps {
  year: number;
  width: number;
  height: number;
}

interface DataItem {
  source: string;
  value: number;
}

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20;
// const INNER_RADIUS = 70;
const INNER_RADIUS = 40;

const colors = [
  "#4269d0",
  "#efb118",
  "#ff725c",
  "#6cc5b0",
  "#3ca951",
  "#ff8ab7",
  "#a463f2",
  "#97bbf5",
  "#9c6b4e",
  "#9498a0",
];

const notNeeded = ["country", "primary_energy", "year"];

// Derived once from the data shape so slice order and color assignment are
// identical for every year. Both matter: the springs animate per-source, and
// React needs a stable key to match a slice to the same component across years.
// const SOURCES: string[] = (() => {
//   const sample = data.find((d) => d.country === "World");
//   return sample
//     ? Object.keys(sample).filter((k) => !notNeeded.includes(k))
//     : [];
// })();

// const colorScale = d3
//   .scaleOrdinal<string, string>()
//   .domain(SOURCES)
//   .range(colors);

// Module scope: no need to rebuild these on every render.
const arcGen = d3.arc();
const pieGenerator = d3
  .pie<any, DataItem>()
  .value((d) => d.value)
  .sort(null); // keep SOURCES order instead of sorting by value

const SOURCES: string[] = (() => {
  const sample = data.find((d) => d.country === "World");
  return sample
    ? Object.keys(sample).filter((k) => !notNeeded.includes(k))
    : [];
})();

const formatSource = (s: string) => {
  const spaced = s.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
};

const colorScale = d3
  .scaleOrdinal<string, string>()
  .domain(SOURCES.map(formatSource))
  .range(colors);

function getDonutDataForYear(year: number | string): DataItem[] {
  const worldRow = data.find(
    (d) => d.country === "World" && d.year === Number(year),
  );
  if (!worldRow) return [];

  return SOURCES.map((key) => ({
    source: formatSource(key), // display name
    value: Number((worldRow as Record<string, unknown>)[key] ?? 0), // raw key
  }));
}

// function getDonutDataForYear(year: number | string): DataItem[] {
//   const worldRow = data.find(
//     (d) => d.country === "World" && d.year === Number(year),
//   );

//   if (!worldRow) return [];

//   return SOURCES.map((source) => ({
//     source,
//     value: Number((worldRow as Record<string, unknown>)[source] ?? 0),
//   }));
// }

export const ResponsiveDonut = ({
  year,
  width,
  height,
}: ResponsiveDonutProps) => {
  const chartData = useMemo(() => getDonutDataForYear(year), [year]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartSize = useDimensions(chartRef);

  if (width === 0 || height === 0) return null;

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <Donut
        height={chartSize.height}
        width={chartSize.width}
        data={chartData}
      />
    </div>
  );
};

interface DonutProps {
  data: DataItem[];
  width: number;
  height: number;
}

const Donut = ({ data, width, height }: DonutProps) => {
  const donutRef = useRef<SVGGElement>(null);

  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;
  const pie = useMemo(() => pieGenerator(data), [data]);

  if (!data.length || radius <= INNER_RADIUS) return null;

  const shapes = pie.map((grp) => (
    <g
      key={grp.data.source}
      className={styles.slice}
      onMouseEnter={() => donutRef.current?.classList.add(styles.hasHighlight)}
      onMouseLeave={() =>
        donutRef.current?.classList.remove(styles.hasHighlight)
      }>
      <Slice
        startAngle={grp.startAngle}
        endAngle={grp.endAngle}
        outerRadius={radius}
        value={grp.value}
        source={grp.data.source}
        color={colorScale(grp.data.source)}
      />
    </g>
  ));

  return (
    <svg width={width} height={height} style={{ display: "inline-block" }}>
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
        className={styles.container}
        ref={donutRef}>
        {shapes}
      </g>
    </svg>
  );
};

interface SliceProps {
  startAngle: number;
  endAngle: number;
  outerRadius: number;
  value: number;
  source: string;
  color: string;
}

const Slice = ({
  startAngle,
  endAngle,
  outerRadius,
  value,
  source,
  color,
}: SliceProps) => {
  const { sa, ea, r, v } = useSpring({
    to: { sa: startAngle, ea: endAngle, r: outerRadius, v: value },
    // config: { friction: 100 },
    // config: { tension: 120, friction: 40, mass: 1 },
    // config: config.slow,
    // config: { duration: 750, easing: easings.easeInOutCubic },
    config: { duration: 750, easing: easings.easeInOutSine },
  });

  // d3 measures angles clockwise from 12 o'clock, so x = R*sin(a), y = -R*cos(a).
  const mid = (s: number, e: number) => (s + e) / 2;

  const d = to(
    [sa, ea, r],
    (s, e, R) =>
      arcGen({
        innerRadius: INNER_RADIUS,
        outerRadius: R,
        startAngle: s,
        endAngle: e,
      }) ?? "",
  );

  const cx = to(
    [sa, ea, r],
    (s, e, R) => (Math.sin(mid(s, e)) * (INNER_RADIUS + R)) / 2,
  );
  const cy = to(
    [sa, ea, r],
    (s, e, R) => (-Math.cos(mid(s, e)) * (INNER_RADIUS + R)) / 2,
  );

  const ix = to(
    [sa, ea, r],
    (s, e, R) => Math.sin(mid(s, e)) * (R + INFLEXION_PADDING),
  );
  const iy = to(
    [sa, ea, r],
    (s, e, R) => -Math.cos(mid(s, e)) * (R + INFLEXION_PADDING),
  );

  const labelX = to([ix], (x) => x + 50 * (x > 0 ? 1 : -1));
  const textX = to([ix], (x) => x + 50 * (x > 0 ? 1 : -1) + (x > 0 ? 2 : -2));
  const anchor = to([ix], (x) => (x > 0 ? "start" : "end"));

  return (
    <>
      <animated.path d={d} fill={color} />
      <animated.circle cx={cx} cy={cy} r={2} />
      <animated.line x1={cx} y1={cy} x2={ix} y2={iy} stroke="black" />
      <animated.line x1={ix} y1={iy} x2={labelX} y2={iy} stroke="black" />
      <animated.text
        x={textX}
        y={iy}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={14}>
        {to([v], (n) => `${source} (${Math.round(n).toLocaleString()})`)}
      </animated.text>
    </>
  );
};
