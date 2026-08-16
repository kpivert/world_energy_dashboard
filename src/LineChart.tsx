import * as d3 from "d3";
import { useRef, useMemo, useEffect } from "react";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const data = [
  { x: 1, y: 90 },
  { x: 2, y: 12 },
  { x: 3, y: 34 },
  { x: 4, y: 53 },
  { x: 5, y: 98 },
];

// type DataPoint = { x: number; y: number };
type Row = { x: number; y: number; group: string };

type LineChartProps = {
  width: number;
  height: number;
  // data: DataPoint[];
  data: Row[];
};

console.log(data);
export const LineChart = ({ width, height, data }: LineChartProps) => {
  const axesRef = useRef<SVGGElement>(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const series = useMemo(
    () =>
      Array.from(
        d3.group(data, (d) => d.group),
        ([name, values]) => ({
          name,
          values: [...values].sort((a, b) => d3.ascending(a.x, b.x)),
        }),
      ),
    [data],
  );

  const [xMin, xMax] = d3.extent(data, (d) => d.x);

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([xMin, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);

  const [yMin, yMax] = d3.extent(data, (d) => d.y);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, yMax || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

  const colorScale = useMemo(
    () =>
      d3
        .scaleOrdinal<string, string>()
        .domain(series.map((s) => s.name))
        .range(d3.schemeTableau10),
    [series],
  );

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const lineBuilder = d3
    // .line<DataPoint>()
    .line<Row>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const linePath = lineBuilder(data);

  if (!linePath) {
    return null;
  }

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
          {series.map((s) => {
            const path = lineBuilder(s.values);
            return path ? (
              <path
                key={s.name}
                d={path}
                stroke={colorScale(s.name)}
                fill="none"
                strokeWidth={2}
              />
            ) : null;
          })}
          {/* <path
            d={linePath}
            opacity={1}
            stroke="#9a6fb0"
            fill="none"
            strokeWidth={2}
          /> */}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
};
