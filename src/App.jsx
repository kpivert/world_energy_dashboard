import { useState, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";
import { data } from "./data.js";
import { ResponsiveDonut } from "./React Donut Chart Transitions.js";
import { DonutDatasetTransition } from "./donut-multiple-datasets.js";
import { LineChart } from "./LineChart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chart4Ref = useRef(null);
  const chart1Size = useDimensions(chart1Ref);
  const chart2Size = useDimensions(chart2Ref);
  const chart3Size = useDimensions(chart3Ref);
  const chart4Size = useDimensions(chart4Ref);

  const world2024 = data
    .filter((d) => d.year === 2024)
    .filter((d) => d.country === "World");

  const world = data.filter((d) => d.country === "World");

  const sampleData = [
    { x: 1, y: 90 },
    { x: 2, y: 12 },
    { x: 3, y: 34 },
    { x: 4, y: 53 },
    { x: 5, y: 98 },
    { x: 6, y: 9 },
    { x: 7, y: 18 },
    { x: 8, y: 78 },
    { x: 9, y: 28 },
    { x: 10, y: 34 },
  ];

  const donutExampleData = Object.entries(world2024).map(([key, value]) => ({
    source: key,
    total: value,
  }));

  const notNeeded = ["country", "primary_energy"];

  const result = Object.entries(world2024[0])
    .filter(([key]) => !notNeeded.includes(key))
    .map(([key, value]) => ({
      source: key,
      value: value,
    }));

  const renewableVars = [
    "year",
    "hydro",
    "solar",
    "wind",
    "biofuel",
    "other_renewable",
  ];

  // This is the dplyr equivalent of select()

  // const renewableData = world.map((row) =>
  //   Object.fromEntries(
  //     renewablesVars.map((variable) => [variable, row[variable]]),
  //   ),
  // );

  // const renewableData: Row[] = world.flatMap((row) =>
  //   renewableVars.map((variable) => ({
  //     x: row.year,
  //     y: row[variable],
  //     group: variable,
  //   })),
  // );

  const renewableData = world.flatMap((row) =>
    renewableVars
      .map((variable) => ({
        x: row.year,
        y: row[variable],
        group: variable,
      }))
      .filter((d) => d.group != "year"),
  );

  console.log(renewableData.filter((d) => d.group != "year"));

  const years = [...new Set(data.map((d) => d.year))].reverse();

  const [year, setYear] = useState("2024");

  return (
    <>
      {/* Overall Dashboard */}

      <div style={{ padding: 20, maxWidth: 500 }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}>
        <h1 className="text-3xl text-black">World Energy Dashboard</h1>
        <div className="gap-4">
          <div className="grid gap-y-4 grid-cols-1 md:grid-cols-2 md:gap-4">
            {/* First Row */}

            {/* Figure 1: Stacked Area Chart */}

            <div
              ref={chart1Ref}
              className="bg-blue-600 border border-black rounded-sm h-100 md:h-75">
              <p className="p-4 text-3xl text-white">This is number 1</p>
              <p className="p-4">
                Stacked Area Chart Showing Global Energy Mix Over Time
              </p>
              <p className="text-2xl text-orange-500">
                Width: {chart1Size.width}
                <br />
                Height: {chart1Size.height}
              </p>
            </div>

            {/* Figure 2: Bar Chart */}

            <div
              ref={chart2Ref}
              className="bg-yellow-500 mb-4 border border-black rounded-sm h-100 md:h-75">
              <p className="p-4 text-white text-3xl ">This is number 2</p>
              <p className="p-4">
                Bar Chart Comparing Energy Consumption Across Countries
              </p>
              <p className="text-2xl text-orange-500">
                Width: {chart2Size.width}
                <br />
                Height: {chart2Size.height}
              </p>

              <p>The selected year is {Number(year) / 3}!</p>
              {/* {console.table(data.filter((d) => d.year === Number(year)))} */}
              <p>
                {data
                  .filter((d) => d.year === Number(year))
                  .map((d) => d.biofuel)}
              </p>
            </div>
          </div>
          <div className="gap-y-28"></div>

          {/* Second Row */}

          {/* Figure 3: Line Chart Tracking the Rise of Renewables */}

          <div className="grid gap-y-4 grid-cols-1 md:grid-cols-2 md:gap-4">
            <div
              ref={chart3Ref}
              className="bg-grey h-100 md:h-75 border rounded-sm">
              {/* <p className="p-4 text-3xl text-white">This is number 3</p>
              <p className="p-4">Line Chart Tracking the Rise of Renewables</p>
              <p className="text-2xl text-orange-500">
                Width: {chart3Size.width}
                <br />
                Height: {chart3Size.height}
              </p> */}
              <LineChart
                width={chart3Size.width}
                height={chart3Size.height}
                data={renewableData}
              />
            </div>

            {/* Figure 4: Donut Chart Showing Energy Mix */}

            <div
              ref={chart4Ref}
              className="bg-grey-40 border rounded-sm h-100 md:h-75">
              {/* <p className="p-4 text-3xl text-white">This is number 4</p>
              <p className="p-4">
                Donut Chart Breaking Down the Energy Mix for a Single Year
              </p>
              <p className="text-2xl text-orange-500">
                Width: {chart4Size.width}
                <br />
                Height: {chart4Size.height}
              </p> */}
              <p className="p-4">World Energy Consumption by Source (TWhs)</p>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full max-w-48">
                  {/* <SelectValue placeholder="Select a Year" /> */}
                  <SelectValue placeholder="Select a Year" />
                </SelectTrigger>
                {/* <SelectContent className="!max-h-[180px]"> */}
                <SelectContent
                  position="popper"
                  side="bottom"
                  sideOffset={4}
                  className="!max-h-[180px]">
                  <SelectGroup>
                    <SelectLabel>Years</SelectLabel>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ResponsiveDonut
                year={year}
                width={chart4Size.width}
                height={chart4Size.height}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
