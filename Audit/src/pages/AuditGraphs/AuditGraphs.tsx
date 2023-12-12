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

async function getComplianceData(id:number):Promise<{xValues:string[],yValues:number[]}>{
  const configuration = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/chart-single-picu-compliance/${id}`,
    headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') }
        };
    try {
        let response = await axios(configuration);
        const data = response.data;
        data.xValues = data.entryDates.map((date:string) => new Date(date).toLocaleDateString("en-GB"));
        data.yValues = data.complianceScore;
        return data;
    } catch (err:any) {
        return{xValues:[],yValues:[]};
    }
}

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
  getData: (id:number) => Promise<{xValues:string[],yValues:number[]}>
}

const allDataTypes:ChartDataType[] = [
  {
    label: "Single PICU Compliance",
    value: "picu",
    getData: async (id:number) => await getComplianceData(sessionStorage.getItem("ROLE") === 'admin' ? id : Number(sessionStorage.getItem("USERNAME")))
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
 * Displays a line chart of the compliance data for site 1
 * @author Adam Logan & Andrew Robb
 * @date 2023-04-28
 * 
 * @todo maybe add a gauge chart for individual PICU compliance https://www.npmjs.com/package/react-gauge-chart
 */
function AuditGraphs() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<{xValues:string[],yValues:number[]}>({xValues:[],yValues:[]});
  const [chartType, setChartType] = useState<LabelValuePair>(allChartTypes[0]);
  const [dataType, setDataType] = useState<ChartDataType>(allDataTypes[0]);

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
    let newCompData = await getData(newPicuId);
    setChartData(newCompData);
    setIsLoading(false);
  }

  useEffect(() => {
    refreshChartData(allDataTypes[0].getData);
  }, []);

  return (
    <PageContainer title="Visualisation" loading={isLoading} icon={<TimelineIcon />}>
      {sessionStorage.getItem("ROLE") === 'admin' &&
        <Autocomplete
          sx={{width: pageWidth, padding: dropDownPadding}}
          defaultValue={allDataTypes[0]}
          onChange={async (e:any, newValue:any) => {
            newValue = newValue ?? allDataTypes[0];
            await setDataType(newValue);
            refreshChartData(newValue.getData, 1);
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

      <div id='graphContainer'>
        {chartType.value === 'line' && (<LineGraph chartData={chartData} title={dataType.label} />)}
        {chartType.value === 'bar' && (<BarChart chartData={chartData} title={dataType.label} />)}
        {chartType.value === 'pie' && (<PieChart chartData={chartData} title={dataType.label} />)}

      </div>
    </PageContainer>
  );
}

export default AuditGraphs;