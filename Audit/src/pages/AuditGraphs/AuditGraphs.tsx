import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import '../../shared/layout.css';
import LineGraph from '../../components/LineGraph/LineGraph';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { adminAuth } from '../Admin/Admin';
import { enqueueSnackbar } from 'notistack';
import { Autocomplete, TextField } from '@mui/material';

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
  const [picuID, setPicuID]  = useState<string|null>(sessionStorage.getItem('ROLE') === 'picu' ? sessionStorage.getItem('SITE')!== null ? sessionStorage.getItem('SITE') : '0' : '0');
  const [idOptions, setIdOptions] = useState<AutoCompleteValues[]>([]);

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
    <div id='form' className='wrapper' style={{width: '100%', backgroundColor: 'aqua'}}>
      <div className = 'content' style={{width: '100%', backgroundColor: 'brown'}}>
        <h1>Delirium Compliance - Audit Form</h1>
        <br />

        <form action="" method="get" style={{width: '100%', backgroundColor: 'purple'}}>
          <div className="data-input">
            <div className = 'row' id = 'UpperTextContainer'>
              <div className='col'>
                <h5>Select the type of chart you would like: </h5>
              </div>

              <div className='col'>
              <Autocomplete
                disablePortal
                id="id"
                autoComplete
                autoHighlight
                isOptionEqualToValue = {(option:AutoCompleteValues, value:AutoCompleteValues) => option.label === value.label}
                options={idOptions}
                renderInput={(params:any) => <TextField {...params} required margin="normal" name="id" label="id" />}
              />
              </div>

              <div className='col'>
                {/* <TypeDropDown text="Chart Type" primaryColour='#025858' secondaryColour='#013e3e' options={["Line Graph", "Pie Chart", "Bar Chart"]}/> */}
              </div>
            </div>
          </div>

          <div className = 'row' id = 'ButtonContainer' style={{width: '100%', backgroundColor: 'green'}}>
            <div className="canvas">
              <LineGraph id={picuID} />
            </div>
          </div> 
        </form>
      </div>
    </div>
  );
}

export default AuditGraphs;