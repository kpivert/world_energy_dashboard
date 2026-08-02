// experimental code with labels

import { useMemo } from "react";
import * as d3 from "d3";
import { useSpring, animated } from "@react-spring/web";

const MARGIN = 10;
const INNER_RADIUS = 40;
const LABEL_MIN_ANGLE = 0.25; // radians; hide labels on slices thinner than this

type DataItem = { name: string; value: number };

type DonutChartProps = {
  width: number;
  height: number;
  data: DataItem[];
};

type SliceProps = {
  color: string;
  radius: number;
  slice: d3.PieArcDatum<DataItem>;
};

type SliceLabelProps = {
  radius: number;
  slice: d3.PieArcDatum<DataItem>;
};

// --- Slice path ---------------------------------------------------------

const Slice = ({ slice, radius, color }: SliceProps) => {
  const arcPathGenerator = d3.arc();

  const springProps = useSpring({
    to: {
      pos: [slice.startAngle, slice.endAngle] as [number, number],
    },
  });

  return (
    <animated.path
      d={springProps.pos.to((start, end) => {
        return arcPathGenerator({
          innerRadius: INNER_RADIUS,
          outerRadius: radius,
          startAngle: start,
          endAngle: end,
        } as any) as string;
      })}
      fill={color}
    />
  );
};

// --- Slice label ---------------------------------------------------------

const SliceLabel = ({ slice, radius }: SliceLabelProps) => {
  const arcGenerator = d3.arc();

  const springProps = useSpring({
    to: {
      pos: [slice.startAngle, slice.endAngle] as [number, number],
    },
  });

  const angle = slice.endAngle - slice.startAngle;
  if (angle < LABEL_MIN_ANGLE) return null;

  return (
    <animated.text
      transform={springProps.pos.to((start, end) => {
        const [x, y] = arcGenerator.centroid({
          innerRadius: INNER_RADIUS,
          outerRadius: radius,
          startAngle: start,
          endAngle: end,
        } as any);
        return `translate(${x}, ${y})`;
      })}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
      fill="white"
      pointerEvents="none">
      {slice.data.name}
    </animated.text>
  );
};

// --- Chart -----------------------------------------------------------

export const DonutChart = ({ width, height, data }: DonutChartProps) => {
  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      ),
    [data],
  );

  const radius = Math.min(width, height) / 2 - MARGIN;

  const pie = useMemo(() => {
    const pieGenerator = d3
      .pie<any, DataItem>()
      .value((d) => d.value || 0)
      .sort(null);
    return pieGenerator(sortedData);
  }, [sortedData]);

  const colors = d3.schemeTableau10;

  const allPaths = pie.map((slice, i) => (
    <Slice
      key={slice.data.name}
      radius={radius}
      slice={slice}
      color={colors[i % colors.length]}
    />
  ));

  const allLabels = pie.map((slice) => (
    <SliceLabel key={slice.data.name} radius={radius} slice={slice} />
  ));

  return (
    <svg width={width} height={height} style={{ display: "inline-block" }}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {allPaths}
        {allLabels}
      </g>
    </svg>
  );
};

// Corrected code
// import { useMemo } from "react";
// import * as d3 from "d3";
// import { animated, useSpring } from "react-spring";
// // import { Slice } from "lucide-react";

// type DataItem = {
//   name: string;
//   value?: number;
// };

// type DonutChartProps = {
//   width: number;
//   height: number;
//   data: DataItem[];
// };

// const MARGIN = 30;

// const colors = [
//   "#e0ac2b",
//   "#e85252",
//   "#6689c6",
//   "#9a6fb0",
//   "#a53253",
//   "#69b3a2",
// ];

// type SliceProps = {
//   color: string;
//   radius: number;
//   slice: d3.PieArcDatum<DataItem>;
// };

// // Defined OUTSIDE and BEFORE DonutChart — no TDZ, no dead code
// const Slice = ({ slice, radius, color }: SliceProps) => {
//   const arcPathGenerator = d3.arc();

//   const springProps = useSpring({
//     to: {
//       pos: [slice.startAngle, slice.endAngle] as [number, number],
//     },
//   });

//   return (
//     <animated.path
//       d={springProps.pos.to((start, end) => {
//         return arcPathGenerator({
//           innerRadius: 40,
//           outerRadius: radius,
//           startAngle: start,
//           endAngle: end,
//         }) as string;
//       })}
//       fill={color}
//     />
//   );
// };

// export const DonutChart = ({ width, height, data }: DonutChartProps) => {
//   const sortedData = useMemo(
//     () =>
//       [...data].sort((a, b) =>
//         a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
//       ),
//     [data],
//   );

//   const radius = Math.min(width, height) / 2 - MARGIN;

//   const pie = useMemo(() => {
//     const pieGenerator = d3
//       .pie<any, DataItem>()
//       .value((d) => d.value || 0)
//       .sort(null);
//     return pieGenerator(sortedData);
//   }, [sortedData]);

//   const colors = d3.schemeTableau10; // or whatever your palette source is

//   const allPaths = pie.map((slice, i) => (
//     <Slice
//       key={slice.data.name}
//       radius={radius}
//       slice={slice}
//       color={colors[i % colors.length]}
//     />
//   ));

//   return (
//     <svg width={width} height={height} style={{ display: "inline-block" }}>
//       <g transform={`translate(${width / 2}, ${height / 2})`}>{allPaths}</g>
//     </svg>
//   );
// };

// Obsolete code

// export const DonutChart = ({ width, height, data }: DonutChartProps) => {
//   // Sort alphabetical for consistency
//   const sortedData = data.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

//   const radius = Math.min(width, height) / 2 - MARGIN;

//   const pie = useMemo(() => {
//     const pieGenerator = d3
//       .pie<any, DataItem>()
//       .value((d) => d.value || 0)
//       .sort(null);
//     return pieGenerator(sortedData);
//   }, [data]);

//   const allPaths = pie.map((slice, i) => {
//     return (
//       <Slice
//         key={slice.data.name}
//         radius={radius}
//         slice={slice}
//         color={colors[i]}
//       />
//     );
//   });

//   return (
//     <svg width={width} height={height} style={{ display: "inline-block" }}>
//       <g transform={`translate(${width / 2}, ${height / 2})`}>{allPaths}</g>
//     </svg>
//   );

//   type SliceProps = {
//     color: string;
//     radius: number;
//     slice: d3.PieArcDatum<DataItem>;
//   };

//   const Slice = ({ slice, radius, color }: SliceProps) => {
//     const arcPathGenerator = d3.arc();

//     const springProps = useSpring({
//       to: {
//         pos: [slice.startAngle, slice.endAngle] as [number, number],
//       },
//     });

//     return (
//       <animated.path
//         d={springProps.pos.to((start, end) => {
//           return arcPathGenerator({
//             innerRadius: 40,
//             outerRadius: radius,
//             startAngle: start,
//             endAngle: end,
//           });
//         })}
//         fill={color}
//       />
//     );
//   };
// };
