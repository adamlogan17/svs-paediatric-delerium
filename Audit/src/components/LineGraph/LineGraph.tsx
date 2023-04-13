import React from "react";
import { Line } from "react-chartjs-2";

function LineGraph(props:{ chartData?:any }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Line Chart</h2>
      <Line
        data={props.chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Compliance Scores"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
export default LineGraph;