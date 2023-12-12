import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { ReactNode } from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

type GraphContainerProps = {
  chartData: {
    xValues: string[],
    yValues: number[]
  },
  title: string,
  children:ReactNode,
  graphRef: any
}

function GraphContainer(props:GraphContainerProps) {
  const handleDownload = () => {
    if (props.graphRef !== null) {
      const chartInstance = (props.graphRef.current as any);
      const base64Image = chartInstance.toBase64Image();
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `${props.title}.png`;
      link.click();
    }
  };

  return (
    <Paper sx={{padding: '10px'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography align="center" variant="h4" sx={{margin:'auto'}}>{props.title}</Typography>
        <Tooltip title="Download">
          <IconButton onClick={handleDownload}>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {(props.chartData.xValues.length === 0 || props.chartData.yValues.length === 0) ? 
        <p style={{ textAlign: "center" }}>No data to display</p> 
      : 
        props.children
      }
    </Paper>
  );
}
export default GraphContainer;