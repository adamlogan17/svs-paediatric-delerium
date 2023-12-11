import { useTheme } from "@mui/material";
import { Bar } from "react-chartjs-2";
import GraphContainer from "../GraphContainer/GraphContainer";

/**
 * This component displays a bar chart using the provided data and options.
 * @param {ChartProps} props - The props that define the chart data and options.
 * @returns {JSX.Element} The `BarChart` component.
 * @author Adam Logan
 */
function BarChart(props:ChartProps) {
  const theme = useTheme();
  const barColor = props.chartColor ?? theme.palette.primary.main;
  const textColor = props.textColor ?? theme.palette.text.primary;

  return (
    <GraphContainer title={props.title} chartData={props.chartData}>
      <Bar
        data={{
          labels: props.chartData.xValues,
          datasets: [{
            backgroundColor: barColor,
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
export default BarChart;