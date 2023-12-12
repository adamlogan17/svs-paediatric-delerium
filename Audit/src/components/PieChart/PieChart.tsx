import { useTheme } from "@mui/material";
import { Pie } from "react-chartjs-2";
import GraphContainer from "../GraphContainer/GraphContainer";
import { useRef } from "react";


function PieChart(props:ChartProps) {
  const theme = useTheme();
  const barColor = props.chartColor ?? theme.palette.primary.main;
  const textColor = props.textColor ?? theme.palette.text.primary;

  const pieRef = useRef(null);

  return (
    <GraphContainer title={props.title} chartData={props.chartData} graphRef={pieRef}>
      <Pie
        ref={pieRef}
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