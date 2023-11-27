import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import '../../shared/layout.css';
import './graphs.css';
import LineGraph from '../../components/LineGraph/LineGraph';
import BarGraph from '../../components/BarChart/BarChart';
import PieChart from '../../components/PieChart/PieChart';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Autocomplete, Avatar, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
  const [chartType, setChartType] = useState<string>('Line Graph');

  // useEffect(() => {
  //   const configuration = {
  //     method: "get",
  //     url: `${process.env.REACT_APP_API_URL}/getPicuIds`,
  //     headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
  //   };

  //   axios(configuration)
  //     .then((result) => {
  //       const allIds = result.data.map((element:{picu_id:string}) => (element.picu_id.toString()));
  //       allIds.sort((a:string, b:string) => (parseInt(a) - parseInt(b)));
  //       setIdOptions(allIds);
  //     })
  //     .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }));
  // }, []);

  const [chartTypeOptions, setChartTypeOptions] = useState<AutoCompleteValues[]>([
    { label: 'Line Graph', value: 'line' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Bar Chart', value: 'bar' },
  ]);

  return (
    <div id='form' className='wrapper' style={{width: '100%'}}>
      <div className = 'content' style={{width: '100%'}}>
        {/* <h1>Delirium Compliance - Audit Form</h1> */}
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Delirium Compliance - Audit Form
        </Typography>
        <br />

        <form id = 'graphContainer' action="" method="get" >          
          <div className = 'gRow' id = 'gInputContainer' style={{margin: 'auto', borderRadius: 25, backgroundColor: '#009379'}}>
              <div className='gRow' style={{width: '100%', margin: 'auto', paddingLeft: '5%', paddingTop: '2%'}}>
                <h3>Select the type of chart you would like: </h3>
              </div>
             <div className = 'gRow' id = 'UpperTextContainer' style={{width: '95%', margin: 'auto', display: 'flex'}}> 
               <div className='gCol' style={{width: '48%', padding: '2%'}}>
                {/* {<TypeDropDown text="Chart Type" primaryColour='#025858' secondaryColour='#013e3e' options={["Line Graph", "Pie Chart", "Bar Chart"]}/>} */}
                <Autocomplete
                  disablePortal
                  id="chartType"
                  autoComplete
                  autoHighlight
                  isOptionEqualToValue = {(option:AutoCompleteValues, value:AutoCompleteValues) => option.label === value.label}
                  options={chartTypeOptions}
                  onChange={(event: any, newValue: any) => setChartType(newValue.label)}
                  renderInput={(params:any) => <TextField {...params} required margin="normal" name="chartType" label="Chart Type" />}
                />
              </div>
              <div className='gCol' style={{width: '48%', padding: '2%'}}>
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
          </div>
          </div>

          <div className = 'gRow' id = 'graphContaine' style={{margin: 'auto', borderRadius: 25, backgroundColor: '#009999'}}>
          <div className="canvas">
          {chartType === 'Bar Chart' ? <BarGraph id={'1'} /> : 
           chartType === 'Line Graph' ? <LineGraph id={'1'} /> : 
           <PieChart id={'1'} />}
        </div>
          </div> 
        </form>
      </div>
    </div>
  );
}

export default AuditGraphs;