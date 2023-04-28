import React from "react";
import { Line } from "react-chartjs-2";

/**
 * Displays a line graph
 * @author Adam Logan & Andrew Robb
 * @date 2023-04-28
 * @param { { chartData?:any } } props
 * @prop { any } [chartData] The data, and configuration of the data, that is to be displayed
 */
function LineGraph(props:{ chartData?:any }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Compliance Score</h2>
      <Line
        data={props.chartData}
        options={{
          scales: {
            y: {
              ticks: {
                color:"#FFFFFF"
              }
            },
            x: {
              ticks: {
                color:"#FFFFFF"
              }
            }
          },
          plugins: {
            title: {
              display: false,
              text: "Compliance Scores",
              color:"#FFFFFF"
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