import { useState } from "react";
import { DonutChart } from "./donut-chart";

const BUTTONS_HEIGHT = 50;

type DonutDatasetTransitionProps = {
  width: number;
  height: number;
};

const data = [
  { name: "Mark", value: 90 },
  { name: "Robert", value: 12 },
  { name: "Etienne", value: undefined },
  { name: "Emily", value: 34 },
  { name: "Nicolas", value: 98 },
  { name: "Marion", value: 53 },
];

const data2 = [
  { name: "Mark", value: 80 },
  { name: "Robert", value: 10 },
  { name: "Etienne", value: 48 },
  { name: "Emily", value: 6 },
  { name: "Nicolas", value: 8 },
  { name: "Marion", value: 45 },
];

const buttonStyle = {
  border: "1px solid #9a6fb0",
  borderRadius: "3px",
  padding: "0px 8px",
  margin: "10px 2px",
  fontSize: 14,
  color: "#9a6fb0",
  opacity: 0.7,
};

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
