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

type DataPoint = { x: number; y: number };
type LineChartProps = {
  width: number;
  height: number;
  data: DataPoint[];
};

console.log(data);
export const LineChart = ({ width, height, data }: LineChartProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xMax = d3.max(data, (d) => d.x);

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);

  const [yMin, yMax] = d3.extent(data, (d) => d.y);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, yMax || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

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
    .line<DataPoint>()
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
          <path
            d={linePath}
            opacity={1}
            stroke="#9a6fb0"
            fill="none"
            strokeWidth={2}
          />
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
