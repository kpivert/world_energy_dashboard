import { useState, useRef } from "react";
import { useDimensions } from "./use-dimensions.js";
import "./App.css";
import { data } from "./data.js";
import { Button } from "./components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function App() {
  const chart1Ref = useRef(null);
  console.log(data.map((d) => d.country));
  return (
    <>
      <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>
          The React Framework – created and maintained by @vercel.
        </HoverCardContent>
      </HoverCard>
      <div style={{ padding: 20, maxWidth: 500 }}>
        <Tabs defaultValue="chart">
          <TabsList>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <p>Your chart would go here!</p>
          </TabsContent>
          <TabsContent value="data">
            <p>Your data table would go here!</p>
          </TabsContent>
        </Tabs>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}>
        <h1 className="text-3xl text-black">World Energy Dashboard</h1>
        <p>Hello world!</p>
        <div
          className="flex gap-4"
          // style={{
          //   display: "flex",
          //   flexDirection: "row",
          // }}
        >
          <div style={{ display: "flex", gap: 8, padding: 20 }}>
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
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
          <Button variant="destructive">ClickClickClick</Button>
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
          className="flex gap-4"
          // style={{
          //   display: "flex",
          //   flexDirection: "row",
          // }}
        >
          <div
            ref={chart1Ref}
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "red",
              border: "3px solid blue",
            }}>
            <p class="text-2xl">This is number 1</p>
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
