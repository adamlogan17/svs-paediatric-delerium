import BasicNavBar from '../../components/NavBar/NavBar';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import PButton from '../../components/PButton/PButton';
import LineChart from '../../components/LineGraph/LineGraph';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";

import '../../shared/layout.css';
import BodyText from '../../components/BodyText/BodyText';


Chart.register(CategoryScale);
function AuditGraphs() {
  const [chartData, setChartData] = useState({
      
  });
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
                <BodyText text = 'THIS IS JUST A PLACEHOLDER TEXT BOX FOR WHAT WILL BE THE GRAPH CANVAS'/>
                <div className="App">
                <LineChart chartData={chartData} />
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