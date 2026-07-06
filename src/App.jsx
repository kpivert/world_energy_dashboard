import { useState, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";
import "./App.css";
import { data } from "./data.js";

function App() {
  const chart1Ref = useRef(null);
  console.log(data.map((d) => d.country));
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}>
        <h1>World Energy Dashboard</h1>
        <p>Hello world!</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}>
          <div
            ref={chart1Ref}
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "red",
              border: "3px solid white",
              padding: 10,
              margin: 30,
            }}>
            <p>This is number 1</p>
          </div>
          <div
            ref={chart1Ref}
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "red",
              border: "3px solid white",
            }}>
            <p>This is number 1</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}>
          <div
            ref={chart1Ref}
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "red",
              border: "3px solid blue",
            }}>
            <p>This is number 1</p>
          </div>
          <div
            ref={chart1Ref}
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "red",
              border: "3px dashed blue",
            }}>
            <p>This is number 1</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
