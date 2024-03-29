import { useTheme } from "@mui/material";import GraphContainer from "../GraphContainer/GraphContainer";
import { useRef } from "react";
import * as ss from 'simple-statistics';
import { alpha } from '@mui/system';
import { Chart } from "react-chartjs-2";

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
  const gridColor = props.gridColor ?? theme.palette.divider;
  const trendLineColor = theme.palette.secondary.main;

  const barRef = useRef(null);

  let trendline:{m:number, b:number} = {m:0, b:0};

  const xValuesAsNum = props.chartData.xValues.map(x => props.convertXToNumber?.(x));

  if(xValuesAsNum[0] !== undefined) {
    trendline = ss.linearRegression(xValuesAsNum.filter(x => x !== undefined).map((x, i) => [x!, props.chartData.yValues[i]]));
  }

  return (
    <GraphContainer title={props.title} chartData={props.chartData} graphRef={barRef}>
      <Chart
        ref={barRef}
        type='bar'
        data={{
          labels: props.chartData.xValues,
          datasets: [
            {
              type:'bar',
              backgroundColor: barColor,
              data: props.chartData.yValues
            },
            {
              type: 'line',
              borderColor: xValuesAsNum[0] !== undefined ? alpha(trendLineColor, 0.5) : alpha(trendLineColor, 0.0),
              data: xValuesAsNum.map(x => trendline.m * (x ?? -1) + trendline.b)
            }
          ]
        }}
        options={{
          scales: {
            y: {
              title: {
                display: true,
                text: props.yAxisLabel,
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
              ticks: {
                color:textColor
              }
            },
            x: {
              title: {
                display: true,
                text: props.xAxisLabel,
                color: textColor,
              },
              grid: {
                color: gridColor,
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
              color:textColor,
              font: {
                size: 35
              }
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