import { useState, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";
import "./App.css";
import { data } from "./data.js";

function App() {
  const chart1Ref = useRef(null);
  console.log(data.map((d) => d.country));
  return (
    <>
      <div></div>
    </>
  );
}

export default App;
