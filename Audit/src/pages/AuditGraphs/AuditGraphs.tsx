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

import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { enqueueSnackbar } from 'notistack';
import ValidaterDatePicker from '../../components/ValidaterDatePicker/ValidaterDatePicker';


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

/**
 * Filters the data based on a date range.
 *
 * @param {{xValues:string[],yValues:number[]}} oldData - The original data to be filtered. It filters on xValues (an array of strings representing dates in 'DD/MM/YYYY' format) 
 * @param {Dayjs} start - The start date of the range as a Dayjs object.
 * @param {Dayjs} end - The end date of the range as a Dayjs object.
 *
 * @returns {Object} An object with the same structure as oldData, but filtered such that only the data 
 *                   where the date falls within the start and end date range is included.
 *
 * @author Adam Logan
 */
function filterDates(oldData:{xValues:string[],yValues:number[]}, start:Dayjs, end:Dayjs):{xValues:string[],yValues:number[]} {
  return {
    xValues: oldData.xValues.filter((dateStr) => {
      const date = dayjs(dateStr, 'DD/MM/YYYY');
      return date.isSameOrAfter(start) && date.isSameOrBefore(end);
    }),
    yValues: oldData.yValues.filter((_, index) => {
      const dateStr = oldData.xValues[index];
      const date = dayjs(dateStr, 'DD/MM/YYYY');
      return date.isSameOrAfter(start) && date.isSameOrBefore(end);
    })
  };
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

const allDataTypes:ChartDataType[] = [
  {
    label: "Single PICU Compliance Data",
    value: "picu",
    getData: async (id:number) => await getComplianceData(sessionStorage.getItem("ROLE") === 'admin' ? id : Number(sessionStorage.getItem("USERNAME"))),
    convertXToNums: convertDatesToNums,
    filter: filterDates,
    xAxisLabel:"Date of Score",
    yAxisLabel:"Compliance Score"
  },
  {
    label: "Overall Compliance",
    value: "overall",
    getData: async () => await getSinglePicu("chart-all-picu-compliance", "complianceScore"),
    xAxisLabel:"PICU ID",
    yAxisLabel:"Overall Score"
  },
  {
    label: "Total Delirium Positive Patients",
    value: "delirium",
    getData: async () => await getSinglePicu("chart-all-picu-delirium-positive", "totalPositiveDelirium"),
    xAxisLabel:"PICU ID",
    yAxisLabel:"% Positive Patients"
  }
];

/**
 * Displays a variety of graphs to analyse audit data.
 * @author Adam Logan
 * 
 * @todo maybe add a gauge chart for individual PICU compliance https://www.npmjs.com/package/react-gauge-chart
 */
function AuditGraphs() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<{xValues:string[],yValues:number[]}>({xValues:[],yValues:[]});
  const [chartType, setChartType] = useState<LabelValuePair>(allChartTypes[0]);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.UTC(1970, 0, 1)));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [picuId, setPicuId] = useState<number>(1);
  const [dataType, setDataType] = useState<ChartDataType>(allDataTypes[0]);

  const specificPicuNeeded:boolean = dataType.value === 'picu' && sessionStorage.getItem("ROLE") === 'admin';

  const dateFormat:string = 'DD/MM/YYYY';

  const dropDownPadding:string = '10px';
  const pageWidth:string = '95%';

  const splitDropdownStyles = {
    width: '50%',
    padding: dropDownPadding
  }

  useEffect(() => {
    setIsLoading(true);
  
    // Create an asynchronous function inside the hook
    async function refreshChartData() {
      // Convert startDate and endDate to 'DD/MM/YYYY' format for comparison
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      try {
        let newCompData = await dataType.getData(picuId);
        newCompData = dataType.filter ? dataType.filter(newCompData, start, end) : newCompData;
        setChartData(newCompData);
      } catch (error) {
        enqueueSnackbar("System Error", { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    refreshChartData();
  }, [startDate, endDate, picuId, dataType]);

  return (
    <PageContainer title="Visualisation" loading={isLoading} icon={<TimelineIcon />}>
      {sessionStorage.getItem("ROLE") === 'admin' &&
        <Autocomplete
          sx={{width: pageWidth, padding: dropDownPadding}}
          defaultValue={allDataTypes[0]}
          onChange={async (e:any, newValue:any) => {
            newValue = newValue ?? allDataTypes[0];
            setDataType(newValue);
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
            defaultValue
            sx={splitDropdownStyles}
            id="picuId" 
            roles={["picu"]} 
            required={true}
            onChange={async (newPicuId) => setPicuId(newPicuId)} 
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
            <ValidaterDatePicker 
              dateFormat={dateFormat} 
              startDate={new Date(Date.UTC(1970, 0, 1))}
              sx={splitDropdownStyles}
              onChange={(newDate) => {
                const valid:boolean = dayjs(newDate).isSameOrBefore(endDate);
                setStartDate((prevDate) => valid ? newDate : prevDate);
                return valid;
              }}
            />

            <ValidaterDatePicker 
              dateFormat={dateFormat} 
              startDate={new Date()}
              sx={splitDropdownStyles}
              onChange={(newDate) => {
                const valid:boolean = dayjs(newDate).isSameOrAfter(startDate) && dayjs(newDate).isSameOrBefore(chartData.xValues[chartData.xValues.length]);
                setEndDate((prevDate) => valid ? newDate : prevDate);
                return valid;
              }}
            />
          </Box>
        }

      <div id='graphContainer'>
        {chartType.value === 'line' && (<LineGraph chartData={chartData} title={dataType.label} convertXToNumber={dataType.convertXToNums} xAxisLabel={dataType.xAxisLabel} yAxisLabel={dataType.yAxisLabel} />)}
        {chartType.value === 'bar' && (<BarChart chartData={chartData} title={dataType.label} convertXToNumber={dataType.convertXToNums} xAxisLabel={dataType.xAxisLabel} yAxisLabel={dataType.yAxisLabel} />)}
        {chartType.value === 'pie' && (<PieChart chartData={chartData} title={dataType.label} />)}
      </div>
    </PageContainer>
  );
}

export default AuditGraphs;