import './graphs.css';

import PageContainer from '../../components/PageContainer/PageContainer';
import { useEffect, useState } from "react";

import TimelineIcon from '@mui/icons-material/Timeline';
import PicuDropDown from "../../components/PicuDropDown/PicuDropDown";
import { Autocomplete, Box, TextField } from "@mui/material";
import axios from "axios";
import LineGraph from "../../components/LineGraph/LineGraph";
import BarChart from '../../components/BarChart/BarChart';
import PieChart from '../../components/PieChart/PieChart';

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Retrieves compliance data for a given ID.
 * 
 * @author Adam Logan
 * @param {string} id - The ID of the data to retrieve.
 * @returns {Promise<{xValues: string[], yValues: number[]}>} A promise that resolves to an object containing xValues and yValues. If an error occurs during the fetch operation, the Promise resolves to an object with 'xValues' and 'yValues' as empty arrays.
 */
async function getComplianceData(id: number): Promise<{ xValues: string[], yValues: number[] }> {
  const configuration = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/chart-single-picu-compliance/${id}`,
    headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') }
  };
  try {
    let response = await axios(configuration);
    const data = response.data;
    data.xValues = data.entryDates.map((date: string) => new Date(date).toLocaleDateString("en-GB"));
    data.yValues = data.complianceScore;
    return data;
  } catch (err: any) {
    return { xValues: [], yValues: [] };
  }
}

/**
 * Fetches data from a specified endpoint and returns an object containing arrays of x-values and y-values.
 * 
 * @author Adam Logan
 * @param {string} endpoint  - The endpoint to fetch data from. This is appended to the base API URL.
 * @param {string} yValue - The property of the response data to use for the y-values.
 * 
 * @returns {Promise<{xValues: string[], yValues: number[]}>}  A promise that resolves to an object containing xValues and yValues. If an error occurs during the fetch operation, the Promise resolves to an object with 'xValues' and 'yValues' as empty arrays.
 */
async function getSinglePicu(endpoint:string, yValue:string):Promise<{xValues:string[],yValues:number[]}>{
  const configuration = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/${endpoint}`,
    headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') }
        };
    try {
        let response = await axios(configuration);
        const data = response.data;
        data.xValues = data.picuId;
        data.yValues = data[yValue];
        return data;
    } catch (err:any) {
        return{xValues:[],yValues:[]};
    }
}

/**
 * Converts a date string in the format "dd/mm/yyyy" to a number representing the date in milliseconds since the Unix Epoch (January 1, 1970 00:00:00 UTC).
 * 
 * @author Adam Logan
 * 
 * @param {string} date - The date string to convert. It should be in the format "dd/mm/yyyy".
 * 
 * @returns {number|undefined} - The date as a number in milliseconds since the Unix Epoch, or undefined if the conversion fails (e.g., if the input is not a valid date string). This function wi;; return undefined if the date string is not in the expected format or if it represents an invalid date.
 */
function convertDatesToNums(date:string):number|undefined {
  try {
    const [day, month, year] = date.split("/");
    return Date.parse(`${month}/${day}/${year}`);
  } catch (err) {
    return undefined;
  }
}

const allChartTypes:LabelValuePair[] = [
  {
    label: "Line Graph",
    value: "line"
  },
  {
    label: "Bar Chart",
    value: "bar",
  },
  {
    label: "Pie Chart",
    value: "pie",
  }
];

type ChartDataType = LabelValuePair & {
  getData: (id:number) => Promise<{xValues:string[],yValues:number[]}>,
  convertXToNums?: (date:string) => number|undefined
}

const allDataTypes:ChartDataType[] = [
  {
    label: "Single PICU Compliance",
    value: "picu",
    getData: async (id:number) => await getComplianceData(sessionStorage.getItem("ROLE") === 'admin' ? id : Number(sessionStorage.getItem("USERNAME"))),
    convertXToNums: convertDatesToNums
  },
  {
    label: "Overall Compliance",
    value: "overall",
    getData: async () => await getSinglePicu("chart-all-picu-compliance", "complianceScore")
  },
  {
    label: "Total Delirium Positive Patients",
    value: "delirium",
    getData: async () => await getSinglePicu("chart-all-picu-delirium-positive", "totalPositiveDelirium")
  }
];

/**
 * Displays a variety of graphs to analyse audit data.
 * @author Adam Logan & Andrew Robb
 * @date 2023-04-28
 * 
 * @todo maybe add a gauge chart for individual PICU compliance https://www.npmjs.com/package/react-gauge-chart
 * @todo trendline messes up whenever the dataType changes, I think it is still passing in the old chartData (maybe just add a try catch? does not work need to remove this from line graph)
 */
function AuditGraphs() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<{xValues:string[],yValues:number[]}>({xValues:[],yValues:[]});
  const [chartType, setChartType] = useState<LabelValuePair>(allChartTypes[0]);
  const [dataType, setDataType] = useState<ChartDataType>(allDataTypes[0]);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.UTC(1970, 0, 1)));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const specificPicuNeeded:boolean = dataType.value === 'picu' && sessionStorage.getItem("ROLE") === 'admin';

  const dropDownPadding:string = '10px';
  const pageWidth:string = '95%';

  const splitDropdownStyles = {
    width: '50%',
    padding: dropDownPadding
  }

  async function refreshChartData(getData:(id:number) => Promise<{xValues:string[],yValues:number[]}>, newPicuId?:number):Promise<void> {
    newPicuId = newPicuId ?? 1;
    setIsLoading(true);

    // Convert startDate and endDate to 'DD/MM/YYYY' format for comparison
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    console.log(start, end);
    let newCompData = await getData(newPicuId);

    newCompData = {
      xValues: newCompData.xValues.filter((dateStr) => {
        const date = dayjs(dateStr, 'DD/MM/YYYY');
        return date.isSameOrAfter(start) && date.isSameOrBefore(end);
      }),
      yValues: newCompData.yValues.filter((_, index) => {
        const dateStr = newCompData.xValues[index];
        const date = dayjs(dateStr, 'DD/MM/YYYY');
        return date.isSameOrAfter(start) && date.isSameOrBefore(end);
      })
    };
    setChartData(newCompData);
    setIsLoading(false);
  }

  useEffect(() => {
    refreshChartData(allDataTypes[0].getData);
  }, [startDate, endDate]);

  return (
    <PageContainer title="Visualisation" loading={isLoading} icon={<TimelineIcon />}>
      {sessionStorage.getItem("ROLE") === 'admin' &&
        <Autocomplete
          sx={{width: pageWidth, padding: dropDownPadding}}
          defaultValue={allDataTypes[0]}
          onChange={async (e:any, newValue:any) => {
            newValue = newValue ?? allDataTypes[0];
            await setDataType(newValue);
            refreshChartData(newValue.getData);
          }}
          disablePortal
          id="chartType"
          autoComplete
          autoHighlight
          isOptionEqualToValue = {(option:LabelValuePair, value:LabelValuePair) => option.label === value.label}
          options={allDataTypes}
          renderInput={(params:any) => <TextField {...params} required margin="normal" name="chartType" label="Data to Display" />}
        />
      }

      <Box 
        sx={{
          mt: 1, 
          width: pageWidth, 
          margin: 'auto', 
          display: 'flex'
        }}
      >
        {specificPicuNeeded &&
          <PicuDropDown 
            sx={splitDropdownStyles}
            id="picuId" 
            roles={["picu"]} 
            required={true}
            onChange={async (newPicuId) => refreshChartData(dataType.getData, newPicuId)} 
          />
        }

        <Autocomplete
          sx={specificPicuNeeded ? splitDropdownStyles : {width: '100%', padding: dropDownPadding}}
          defaultValue={allChartTypes[0]}
          onChange={(e:any, newValue:any) => setChartType(newValue ?? allChartTypes[0])}
          disablePortal
          id="chartType"
          autoComplete
          autoHighlight
          isOptionEqualToValue = {(option:LabelValuePair, value:LabelValuePair) => option.label === value.label}
          options={allChartTypes}
          renderInput={(params:any) => <TextField {...params} required margin="normal" name="chartType" label="Chart Type" />}
        />
      </Box>

        {specificPicuNeeded && 
          <Box sx= {{
            mt: 1, 
            width: pageWidth, 
            margin: 'auto', 
            display: 'flex'
          }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker sx={splitDropdownStyles} value={dayjs(new Date(Date.UTC(1970, 0, 1)))} format='DD/MM/YYYY' onChange={(newDate) => {setStartDate(newDate !== null ? newDate.toDate() : new Date())}} />
              <DatePicker  sx={splitDropdownStyles} defaultValue={dayjs(new Date())} format='DD/MM/YYYY' onChange={(newDate) =>  {setEndDate(newDate !== null ? newDate.toDate() : new Date())}}/>
            </LocalizationProvider>

          </Box>
        }

      <div id='graphContainer'>
        {chartType.value === 'line' && (<LineGraph chartData={chartData} title={dataType.label} convertXToNumber={dataType.convertXToNums} />)}
        {chartType.value === 'bar' && (<BarChart chartData={chartData} title={dataType.label} convertXToNumber={dataType.convertXToNums} />)}
        {chartType.value === 'pie' && (<PieChart chartData={chartData} title={dataType.label} />)}

      </div>
    </PageContainer>
  );
}

export default AuditGraphs;