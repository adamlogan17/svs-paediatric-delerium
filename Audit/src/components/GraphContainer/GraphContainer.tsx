import { Paper } from "@mui/material";
import { ReactNode } from "react";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

type GraphContainerProps = {
  chartData: {
    xValues: string[],
    yValues: number[]
  },
  title: string,
  children:ReactNode
}

function GraphContainer(props:GraphContainerProps) {
  return (
    <Paper sx={{padding: '10px'}}>
      <h2 style={{ textAlign: "center" }}>{props.title}</h2>
      {(props.chartData.xValues.length === 0 || props.chartData.yValues.length === 0) ? 
        <p style={{ textAlign: "center" }}>No data to display</p> 
      : 
        props.children
      }
    </Paper>
  );
}
export default GraphContainer;