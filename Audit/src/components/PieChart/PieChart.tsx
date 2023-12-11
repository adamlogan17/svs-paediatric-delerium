import { useTheme } from "@mui/material";
import { Pie } from "react-chartjs-2";
import GraphContainer from "../GraphContainer/GraphContainer";


function PieChart(props:ChartProps) {
  const theme = useTheme();
  const barColor = props.chartColor ?? theme.palette.primary.main;
  const textColor = props.textColor ?? theme.palette.text.primary;

  return (
    <GraphContainer title={props.title} chartData={props.chartData}>
      <Pie
        data={{
          labels: props.chartData.xValues,
          datasets: [{
            backgroundColor: barColor,
            data: props.chartData.yValues
          }]
        }}
        options={{
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
export default PieChart;