import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { ReactNode } from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

/**
 * Type definition for the properties of the GraphContainer component.
 * 
 * @author Adam Logan
 * 
 * @typedef {Object} GraphContainerProps
 * 
 * @property {Object} chartData - The data to be displayed in the chart. It should be an object with two properties:
 * - xValues: An array of strings representing the x-values.
 * - yValues: An array of numbers representing the y-values.
 * 
 * @property {string} [title] - The title of the chart.
 * 
 * @property {ReactNode} children - The child components to be rendered within the GraphContainer component.
 * 
 * @property {any} graphRef - A reference to the chart component. This is used for downloading the chart as an image.
 */
type GraphContainerProps = {
  chartData: {
    xValues: string[],
    yValues: number[]
  },
  title?: string,
  children:ReactNode,
  graphRef: any
}

/**
 * A container component for displaying a chart and its title, with an option to download the chart as an image.
 * 
 * @author Adam Logan
 * 
 * @param {GraphContainerProps} props - The properties of the GraphContainer component.
 * 
 * @returns {JSX.Element} A Paper component containing the chart title, a download button, and either the chart itself or a message indicating that there is no data to display.
 */
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
      <Box display="flex" justifyContent="flex-end" alignItems="center">
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