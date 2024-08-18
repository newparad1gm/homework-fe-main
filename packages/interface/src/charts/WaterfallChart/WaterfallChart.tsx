import cx from "classnames";
import React, { FunctionComponent, useMemo } from "react";
import styles from "./WaterfallChart.module.scss";
import { WaterfallChartProps } from "./types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ReferenceLine } from 'recharts';
import { ChartColumn, ColumnType } from "./types";

export const WaterfallChart: FunctionComponent<WaterfallChartProps> = (
  props
) => {
  const { className, series } = props;

  const chartData = useMemo(() => {
    // Prepare data for the chart
    let chartData: ChartColumn[] = [];
    let accumulatedValue = 0;
    let index = 0;
    if (series.length) {
      chartData = series.map(item => {
        if (item.type === ColumnType.Start) {
          accumulatedValue = item.value;
          return { 
            ...item, 
            label: 'start',
            accumulatedValue,
            lower: accumulatedValue, 
            upper: 0
          };
        } else {
          const prev = accumulatedValue;
          accumulatedValue += item.value;
          const diff = accumulatedValue - prev;
          return { 
            ...item, 
            label: String(index++),
            accumulatedValue,
            lower: Math.min(prev, accumulatedValue),
            upper: Math.abs(diff),
          };
        }
      });
      // add end column
      chartData.push({
        label: 'end',
        value: accumulatedValue,
        type: ColumnType.End,
        accumulatedValue,
        lower: accumulatedValue,
        upper: 0,
      })
    }

    return chartData;
  }, [series]);

  return (
    <div className={cx(styles["waterfall-chart"], className)}>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        layout="vertical"
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
        style={{ backgroundColor: '#000000' }}
      >
        <XAxis type="number" tick={false} stroke='#FFFFFF' axisLine={{ stroke: '#808080' }} />
        <YAxis dataKey="label" type="category" stroke='#FFFFFF' axisLine={{ stroke: '#808080' }} />
        <Tooltip />

        {/* Render the connecting lines between bars */}
        {chartData.map((entry, index) => {
          if (index > 0 && index < chartData.length) {
            const prev = chartData[index - 1]
            const xValue = prev.accumulatedValue;
            const yPrev = prev.label;
            const yCurr = entry.label;

            return (
              <ReferenceLine
                segment={[{ x: xValue, y: yPrev }, { x: xValue, y: yCurr }]}
                stroke='#808080'
              />
            );
          }
          return null;
        })}

        {/* Lower transparent bar or start/end gray bars */}
        <Bar 
          dataKey="lower" 
          barSize={20} 
          stackId='a'
        >
          <ReferenceLine
            segment={[{ x: 100, y: 'start' }, { x: 100, y: '0' }]}
            stroke="black"
          />
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.type === ColumnType.Start || entry.type === ColumnType.End ? '#808080' : 'transparent'}
            />
          ))}
        </Bar>

        {/* Upper colored bars for waterfall chart look */}
        <Bar 
          dataKey='upper' 
          barSize={20} 
          stackId='a'
        >
          <LabelList
            dataKey='value'
            position='insideRight'
            angle={0}
            offset={5}
            fill='#FFFFFF'
          />
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-sv-${index}`}
              fill={entry.value > 0 ? '#3CB371' : '#8B0000'} // Color the bars based on value
            />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};
