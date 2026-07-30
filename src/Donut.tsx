import * as d3 from "d3";
import { data } from "./data.js";
import { useMemo, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";

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

const MARGIN = 30;

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

  console.log(data2024);

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
  const radius = Math.min(width, height) / 2 - MARGIN;
  const pieGenerator = d3.pie<any, DataItem>().value((d) => d.value);

  const pie = useMemo(() => pieGenerator(data2024), [data2024]);

  const arcPathGenerator = d3.arc();

  const arcs = pie.map(
    (p) =>
      arcPathGenerator({
        innerRadius: 0,
        outerRadius: radius,
        startAngle: p.startAngle,
        endAngle: p.endAngle,
      }) ?? undefined,
  );

  return (
    <div>
      <svg width={width} height={height} style={{ display: "inline-block" }}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc, i) => {
            return <path key={i} d={arc} fill={colors[i]} />;
          })}
        </g>
      </svg>
    </div>
  );
};

// export default ResponsiveDonut;
