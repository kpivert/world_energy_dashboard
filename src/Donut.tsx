import * as d3 from "d3";
import { data } from "./data.js";
import { useMemo, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";
import styles from "./donut-chart.module.css";

interface ResponsiveDonutProps {
  data2024: { source: string; value: number }[];
  width: number;
  height: number;
}

interface DataItem {
  source: string;
  value: number;
}

const world2024 = data
  .filter((d) => d.year === 2024)
  .filter((d) => d.country === "World");

const notNeeded = ["country", "primary_energy", "year"];

export const data2024 = Object.entries(world2024[0])
  .filter(([key]) => !notNeeded.includes(key))
  .map(([key, value]) => ({
    source: key,
    value: value,
  })) as DataItem[];

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20;

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

export const ResponsiveDonut = ({
  data2024,
  width,
  height,
}: ResponsiveDonutProps) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <Donut
        height={chartSize.height}
        width={chartSize.width}
        data2024={data2024}
      />
    </div>
  );
};

const Donut = ({ data2024, width, height }: ResponsiveDonutProps) => {
  const donutRef = useRef(null);
  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;
  const pieGenerator = d3.pie<any, DataItem>().value((d) => d.value);

  const pie = useMemo(() => pieGenerator(data2024), [data2024]);

  const arcPathGenerator = d3.arc();

  const shapes = pie.map((grp, i) => {
    // First Arc is for the Pie...then donut

    const sliceInfo = {
      innerRadius: 0,
      outerRadius: radius,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };

    const centroid = arcPathGenerator.centroid(sliceInfo);
    const slicePath = arcPathGenerator(sliceInfo);
    console.log(centroid);
    // Second Arc is for the Legend Inflexion Point

    const inflexionInfo = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };

    const inflexionPoint = arcPathGenerator.centroid(inflexionInfo);

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";
    const label = grp.data.source + " (" + grp.value + ")";

    return (
      <g
        key={i}
        className={styles.slice}
        onMouseEnter={() => {
          if (donutRef.current) {
            donutRef.current.classList.add(styles.hasHighlight);
          }
        }}
        onMouseLeave={() => {
          if (donutRef.current) {
            donutRef.current.classList.remove(styles.hasHighlight);
          }
        }}>
        <path d={slicePath} fill={colors[i]} />
        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflexionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={14}>
          {label}
        </text>
      </g>
    );
  });

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
