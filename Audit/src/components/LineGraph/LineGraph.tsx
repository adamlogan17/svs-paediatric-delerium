import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

/**
 * Creates the object required to set the values for a Line Chart, an important note is that the parameters must be the same length
 * @author Adam Logan
 * @date 2023-04-28
 * @param { string[] } xValues The va
 * @param { number[] } yValues
 * @returns { any }
 */
function getLineChartData(xValues: string[], yValues:number[]) : any {
  return {
    labels: xValues,
    datasets: [{
      pointRadius: 1,
      borderColor: "rgba(255,255,255,1)",
      data: yValues
    }]
  }
}

/**
 * 
 */
async function getComplianceData(id:string):Promise<{entryDates:string[],complianceScore:number[]}>{
      const configuration = {
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/chartData/singleSite/${id}`,
          headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') }
              };
          try {
              let response = await axios(configuration);
              console.log(response);
              return response.data;
          } catch (err:any) {
              console.log(err);
              return{entryDates:[],complianceScore:[]}
          }
}


/**
 * Displays a line graph
 * @author Adam Logan & Andrew Robb
 * @date 2023-04-28
 * @param { { chartData?:any } } props
 * @prop { any } [props.chartData] The data, and configuration of the data, that is to be displayed
 */
function LineGraph(props:{ id:string|null }) {
// the below code is required to call the API when the page loads
  const [chartData, setChartData] = useState({
    entryDates: ['1970-01-01T00:00:00.000Z'], complianceScore:[0]
  });

  useEffect(() => {
  async function fetchData(id:string) {
    let data = await getComplianceData(id);
    setChartData(data);
  }
  console.log("prop", props.id);
  fetchData(props.id === null ? '0' : props.id);
}, []); // Or [] if effect doesn't need props or state

  console.log(chartData);

  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Compliance Score</h2>
      <Line
        data={getLineChartData(chartData.entryDates.map((date:string) => new Date(date).toLocaleDateString("en-GB")), chartData.complianceScore)}
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