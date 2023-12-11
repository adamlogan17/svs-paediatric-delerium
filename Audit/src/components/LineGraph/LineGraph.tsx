import { useTheme } from "@mui/material";
import { Line } from "react-chartjs-2";
import GraphContainer from "../GraphContainer/GraphContainer";

/**
 * This component displays a line graph using the provided data and options.
 * 
 * @author Adam Logan & Andrew Robb
 * 
 * @param {ChartProps} props - The props that define the chart data and options.
 * @returns {JSX.Element} The `LineGraph` component.
 */
function LineGraph(props:ChartProps) {
  const theme = useTheme();
  const lineColor = props.lineColor ?? theme.palette.primary.main;
  const textColor = props.textColor ?? theme.palette.text.primary;

  return (
    <GraphContainer title={props.title} chartData={props.chartData}>
      <Line
        data={{
          labels: props.chartData.xValues,
          datasets: [{
            pointRadius: 1,
            borderColor: lineColor,
            data: props.chartData.yValues
          }]
        }}
        options={{
          scales: {
            y: {
              grid: {
                color: props.gridColor,
              },
              ticks: {
                color:textColor
              }
            },
            x: {
              grid: {
                color: props.gridColor,
              },
              ticks: {
                color:textColor
              }
            }
          },
          plugins: {
            title: {
              display: false,
              text: props.title,
              color:textColor
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </GraphContainer>
  );
}
export default LineGraph;