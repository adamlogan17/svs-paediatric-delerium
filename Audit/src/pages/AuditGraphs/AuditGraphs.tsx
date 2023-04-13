import BasicNavBar from '../../components/NavBar/NavBar';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import PButton from '../../components/PButton/PButton';
import LineChart from '../../components/LineGraph/LineGraph';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import BodyText from '../../components/BodyText/BodyText';
import useGetAPI from '../../hooks/useAPI/useAPI';

import '../../shared/layout.css';
import axios from 'axios';



Chart.register(CategoryScale);

function getLineChartData(xValues: number[], yValues:Date[]) : any {
  return {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        pointRadius: 1,
        borderColor: "rgba(255,0,0,0.5)",
        data: yValues
      }]
    }
  };
}

function AuditGraphs() { 
  // const { complianceScore , entryDates } = useGetAPI([], "http://localhost:8000/chartData/singleSite/1");

  // console.log(useGetAPI([], "http://localhost:8000/chartData/singleSite/1"));
  // console.log(useGetAPI([], "http://localhost:8000/chartData/singleSite/1").toString());

  const configuration = {
    method: "get",
    url: "http://localhost:8000/chartData/singleSite/1"
};

  // make the API call
  axios(configuration)
      .then((result) => {
          // sets the cookies
          console.log(result.data);

          // redirect user to another page
          // window.location.href = "/";
      })
      .catch((error) => error = new Error());

  // let test = getLineChartData(entryDates.map((date:string) => new Date(date)), complianceScore);
  // console.log(test.toString())

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
                              <h5>Select your PICU number from this list: </h5>
                              <TypeDropDown text="Site Number" primaryColour='#025858' secondaryColour='#013e3e' options={Array.from({length: 29}, (_, i) => ("s" + (i + 1)).toString())}/>
                          </div>
                          <div className='col'>
                              <h5>Select the type of chart you would like: </h5>
                              <TypeDropDown text="Chart Type" primaryColour='#025858' secondaryColour='#013e3e' options={["Line Graph", "Pie Chart", "Bar Chart"]}/>
                          </div>
                  </div>
      
              </div>
              <div className = 'row' id = 'ButtonContainer'>
                  {/* <BodyText text = 'THIS IS JUST A PLACEHOLDER TEXT BOX FOR WHAT WILL BE THE GRAPH CANVAS'/> */}
                  <div className="canvas">
                  {/* <LineChart chartData={getLineChartData(entryDates.map((date:string) => new Date(date)), complianceScore)} /> */}
                  </div>
              </div>
                  <PButton text="Submit" onButtonClick = {() => {console.log("Hello World")}} primaryColour='#025858' secondaryColour='#013e3e'/>
              </form>
              
              
              {/* <div className = 'row' id = 'UpperTextContainer'>
                <div className='col'>
                  
                  </div>
              </div>

              <div className = 'row' id = 'ButtonContainer'>
                
              </div>

              <div className = 'row' id = 'ContactInfoContainer'>
                
              </div> */}
          </div>
        </div>
  );
}

export default AuditGraphs;