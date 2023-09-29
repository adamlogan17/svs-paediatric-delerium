import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import '../../shared/layout.css';
import LineGraph from '../../components/LineGraph/LineGraph';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { adminAuth } from '../Admin/Admin';
import { enqueueSnackbar } from 'notistack';

Chart.register(CategoryScale);

/**
 * Calls the 'login' API and, if successful, sets the role, username and JWT token in session storage
 * @author Adam Logan
 * @date 2023-04-28
 * @param { string|undefined } username The username provided
 * @param { string|undefined } password The password provided
 * @returns { void }
 */
function getPicuCompData(username:string|undefined, password:string|undefined):void {
    const configuration = {
        method: "get",
        url: "https://localhost:8000/getPicuData", 
        headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN')}
    };
    
    // make the API call
    axios(configuration)
      .then((result) => {
        console.log(result);
        })
      .catch((error) => error = new Error());
    }

    function getAllCompData(username:string|undefined, password:string|undefined):void {
    const configuration = {
        method: "get",
        url: "https://localhost:8000/getAll", 
        headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN')}
    };
    
    // make the API call
    axios(configuration)
      .then((result) => {
        console.log(result);
        return result;
        })
      .catch((error) => error = new Error());
    }

/**
 * Displays a line chart of the compliance data for site 1
 * @author Adam Logan & Andrew Robb
 * @date 2023-04-28
 * TODO Make the data displayed actually show that of the current user and not just site 1
 */
function AuditGraphs() {
  
  const [picuID, setPicuID]  = useState<string|null>('0');
  const [idOptions, setIdOptions] = useState<RoleAutoComplete[]>([]);

  //-----------------------------------------------------
  //if admin{ function getAllCompData}
  if(sessionStorage.getItem('ROLE') === 'picu'){
    setPicuID(sessionStorage.getItem('USERNAME')!== null ? sessionStorage.getItem('USERNAME') : '0')
    // Data Manipulation to get comp score and dates
    //setChartData();
  }else{
    setPicuID('1');
    // Data Manipulation to get comp score and dates
    //setChartData();
  }

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/getPicuIds`,
      headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
    };

    axios(configuration)
      .then((result) => {
        const allIds = result.data.map((element:{picu_id:string}) => (element.picu_id.toString()));
        allIds.sort((a:string, b:string) => (parseInt(a) - parseInt(b)));
        setIdOptions(allIds);
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }));
  }, []);

  return (
    <div id='form' className='wrapper'>
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
              <LineGraph id={picuID} /> 
            </div>
          </div>

          {/* <PButton text="Submit" onButtonClick = {() => {console.log("Hello World")}} primaryColour='#025858' secondaryColour='#013e3e'/> */}
        </form>
      </div>
    </div>
  );
}

export default AuditGraphs;