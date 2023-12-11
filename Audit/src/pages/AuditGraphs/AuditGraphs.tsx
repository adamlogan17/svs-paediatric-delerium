import './graphs.css';

import PageContainer from '../../components/PageContainer/PageContainer';
import { useState } from "react";

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
    url: `${process.env.REACT_APP_API_URL}/chartData/singleSite/${id}`,
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

const allChartTypes:LabelValuePair[] = [
  {
    label: "Line",
    value: "line"
  },
  {
    label: "Bar",
    value: "bar",
  },
  {
    label: "Pie",
    value: "pie",
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
  const [chartType, setChartType] = useState<any>(allChartTypes[0]);

  function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const dropdownStyles = {
    width: '50%',
    padding: '10px'
  }

  return (
    <PageContainer title="Visualisation" loading={isLoading} icon={<TimelineIcon />}>
      <Box 
        component="form" 
        onSubmit={(event) => handleSubmit(event)} 
        noValidate 
        sx={{
          mt: 1, 
          width: '95%', 
          margin: 'auto', 
          display: 'flex'
        }}
      >
        <PicuDropDown 
          sx={dropdownStyles}
          id="picuId" 
          roles={["picu"]} 
          required={true}
          onChange={async (newPicuId) => {
            setIsLoading(true);
            let newCompData = await getComplianceData(newPicuId);
            setChartData(newCompData);
            setIsLoading(false);
          }} 
        />

        <Autocomplete
          sx={dropdownStyles}
          onChange={(e:any, newValue:any) => setChartType(newValue)}
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
        {chartType.value === 'line' && (<LineGraph chartData={chartData} title="Compliance Score" />)}
        {chartType.value === 'bar' && (<BarChart chartData={chartData} title="Compliance Score" />)}
        {chartType.value === 'pie' && (<PieChart chartData={chartData} title="Compliance Score" />)}

      </div>
    </PageContainer>
  );
}

export default AuditGraphs;