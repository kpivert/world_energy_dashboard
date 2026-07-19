import * as d3 from "d3";
import { data } from "./data.js";

interface ResponsiveDonutProps {
  data2024: { source: string; value: number }[];
  width: number;
  height: number;
}

const world2024 = data
  .filter((d) => d.year === 2024)
  .filter((d) => d.country === "World");

const notNeeded = ["country", "primary_energy", "year"];

const data2024 = Object.entries(world2024[0])
  .filter(([key]) => !notNeeded.includes(key))
  .map(([key, value]) => ({
    source: key,
    value: value,
  }));

export const ResponsiveDonut = ({
  data2024,
  width,
  height,
}: ResponsiveDonutProps) => {
  if (width === 0 || height === 0) {
    return null;
  }

  return null;

  const Donut = ({ data2024, width, height }: ResponsiveDonutProps) => {
    return null;
  };
};

export default ResponsiveDonut;
