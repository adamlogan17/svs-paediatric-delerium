import { useTheme } from "@mui/material";
import { Line } from "react-chartjs-2";
import { alpha } from '@mui/system';
import GraphContainer from "../GraphContainer/GraphContainer";
import { useRef } from "react";
import * as ss from 'simple-statistics';

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
  const lineColor = props.chartColor ?? theme.palette.primary.main;
  const textColor = props.textColor ?? theme.palette.text.primary;
  const gridColor = props.gridColor ?? theme.palette.divider;

  const lineRef = useRef(null);

  let trendline:{m:number, b:number} = {m:0, b:0};

  const xValuesAsNum = props.chartData.xValues.map(x => props.convertXToNumber?.(x));

  if(xValuesAsNum[0] !== undefined) {
    try {
      trendline = ss.linearRegression(xValuesAsNum.filter(x => x !== undefined).map((x, i) => [x!, props.chartData.yValues[i]]));
    } catch (err) {
      xValuesAsNum[0] = undefined;
    }
  }

  return (
    <GraphContainer title={props.title} chartData={props.chartData} graphRef={lineRef}>
      <Line
        ref={lineRef}
        data={{
          labels: props.chartData.xValues,
          datasets: [
            {
              pointRadius: 5,
              borderColor: lineColor,
              pointBackgroundColor: lineColor,
              data: props.chartData.yValues,
              tension: 0.1
            },
            {
              pointRadius: 1,
              borderColor: xValuesAsNum[0] !== undefined ? alpha(lineColor, 0.5) : alpha(lineColor, 0.0),
              data: xValuesAsNum.map(x => trendline.m * (x ?? -1) + trendline.b),
              tension: 0.5
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
                color:textColor,
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
export default LineGraph;