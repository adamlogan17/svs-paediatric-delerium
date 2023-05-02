import BasicNavBar from '../../components/NavBar/NavBar';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import '../../shared/layout.css';
import LineGraph from '../../components/LineGraph/LineGraph';
import axios from 'axios';
import { useEffect, useState } from 'react';

Chart.register(CategoryScale);

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
 * Displays a line chart of the compliance data for site 1
 * @author Adam Logan & Andrew Robb
 * @date 2023-04-28
 * TODO Make the data displayed actually show that of the current user and not just site 1
 */
function AuditGraphs() {
  // the below code is required to call the API when the page loads
  const [chartData, setChartData] = useState({
    entryDates: ['1970-01-01T00:00:00.000Z'], complianceScore:[0]
  });

  useEffect(() => {
      const fetchAPI = async () => {
          const configuration = {
                  method: "get",
                  url: "http://localhost:8000/chartData/singleSite/1",
                  headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') }
              };
          try {
              let response = await axios(configuration);
              console.log(response);
              setChartData(response.data);
          } catch (err:any) {
              console.log(err);
          }
      };
      fetchAPI();
  }, []);

  console.log(chartData);

  return (
    <div id='form' className='wrapper'>

      <BasicNavBar />

      <div className = 'content'>
        <h1>Delirium Compliance - Audit Form</h1>
        <br />

        <form action="" method="get">
          <div className="data-input">
            <div className = 'row' id = 'UpperTextContainer'>
              <div className='col'>
                <h5>Select the type of chart you would like: </h5>
              </div>
              <div className='col'>
                <TypeDropDown text="Chart Type" primaryColour='#025858' secondaryColour='#013e3e' options={["Line Graph", "Pie Chart", "Bar Chart"]}/>
              </div>
            </div>
          </div>

          <div className = 'row' id = 'ButtonContainer'>
            <div className="canvas">
              <LineGraph chartData={getLineChartData(chartData.entryDates.map((date:string) => new Date(date).toLocaleDateString("en-GB")), chartData.complianceScore)} /> 
            </div>
          </div>

          {/* <PButton text="Submit" onButtonClick = {() => {console.log("Hello World")}} primaryColour='#025858' secondaryColour='#013e3e'/> */}
        </form>
      </div>
    </div>
  );
}

export default AuditGraphs;