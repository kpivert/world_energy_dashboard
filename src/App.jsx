import { useState, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";
import "./App.css";
import { data } from "./data.js";
import { ResponsiveDonut } from "./Donut.jsx";

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

  const donutExampleData = Object.entries(world2024).map(([key, value]) => ({
    source: key,
    total: value,
  }));

  const notNeeded = ["country", "primary_energy", "year"];

  const result = Object.entries(world2024[0])
    .filter(([key]) => !notNeeded.includes(key))
    .map(([key, value]) => ({
      source: key,
      value: value,
    }));

  console.log(result);
  // console.log(result);
  // console.log(data.map((d) => d.country));
  // console.log(chart1Size.height, chart1Size.width);
  // console.log(
  //   data
  //     .filter((d) => d.year === 2024)
  //     .filter((d) => d.country === "World")
  //     .map(
  //       ({
  //         biofuel,
  //         coal,
  //         gas,
  //         nuclear,
  //         hydro,
  //         solar,
  //         wind,
  //         other_renewable,
  //       }) => ({
  //         biofuel,
  //         coal,
  //         gas,
  //         nuclear,
  //         hydro,
  //         solar,
  //         wind,
  //         other_renewable,
  //       }),
  //     ),
  // );
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
            </div>
          </div>
          <div className="gap-y-28"></div>
          {/* Second Row */}
          <div className="grid gap-y-4 grid-cols-1 md:grid-cols-2 md:gap-4">
            <div
              ref={chart3Ref}
              className="bg-orange-700 h-100 md:h-75 border rounded-sm">
              <p className="p-4 text-3xl text-white">This is number 3</p>
              <p className="p-4">Line Chart Tracking the Rise of Renewables</p>
              <p className="text-2xl text-orange-500">
                Width: {chart3Size.width}
                <br />
                Height: {chart3Size.height}
              </p>
            </div>
            <div
              ref={chart4Ref}
              className="bg-green-600 border rounded-sm h-100 md:h-75">
              <p className="p-4 text-3xl text-white">This is number 4</p>
              <p className="p-4">
                Donut Chart Breaking Down the Energy Mix for a Single Year
              </p>
              <p className="text-2xl text-orange-500">
                Width: {chart4Size.width}
                <br />
                Height: {chart4Size.height}
              </p>
              <ResponsiveDonut />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
