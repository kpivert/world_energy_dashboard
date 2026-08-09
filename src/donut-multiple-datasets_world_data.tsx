import { useState, useMemo, useRef } from "react";
import { DonutChart } from "./donut-chart";
import * as d3 from "d3";
import { data } from "./data.js";
import { useDimensions } from "./use-dimensions.js";
import styles from "./donut-chart.module.css";
import { useSpring, animated, to } from "@react-spring/web";

type DonutDatasetTransitionProps = {
  width: number;
  height: number;
};

interface ResponsiveDonutProps {
  year: number;
  width: number;
  height: number;
}

interface DataItem {
  source: string;
  value: number;
}

export const DonutDatasetTransition = ({
  width,
  height,
}: DonutDatasetTransitionProps) => {
  const [selectedData, setSelectedData] = useState(data);

  return (
    <div>
      <div style={{ height: BUTTONS_HEIGHT }}>
        <button style={buttonStyle} onClick={() => setSelectedData(data)}>
          Data 1
        </button>
        <button style={buttonStyle} onClick={() => setSelectedData(data2)}>
          Data 2
        </button>
      </div>
      <DonutChart
        width={width}
        height={height - BUTTONS_HEIGHT}
        data={selectedData}
      />
    </div>
  );
};
