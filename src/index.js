// TODO
// tooltip: under, white on translucent dark grey, point on top edge
// left axis: $10k
// right axis: Jun'19
// dots: remove slight white border
// padding on all sides
// grid darker line
// generate a set of dates, use them for the axes
// convert strings with commas to number
import React, { useState } from "react";
import { render } from "react-dom";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  ScatterSeries,
  Title,
  Legend,
  Tooltip
} from "@devexpress/dx-react-chart-material-ui";
import {
  EventTracker,
  ArgumentScale,
  ValueScale
} from "@devexpress/dx-react-chart";
import "./styles.css";
import { symbol, symbolCircle } from "d3-shape";
import { scaleTime } from "d3-scale";
import moment from "moment";

export function App() {
  const [data, setData] = useState([
    { value: 35000, argument: new Date(2019, 0, 1) },
    { value: 25000, argument: new Date(2019, 0, 28) },
    { value: 21000, argument: new Date(2019, 3, 1) },
    { value: 39000, argument: new Date(2019, 4, 17) },
    { value: 40000, argument: new Date(2019, 6, 1) }
  ]);

  const seriesColour = "#00ac00";

  const Point = (type, pointStyles) => props => {
    const { arg, val, color } = props;
    return (
      <path
        fill={color}
        transform={`translate(${arg} ${val})`}
        d={symbol()
          .size([80])
          .type(type)()}
        style={pointStyles}
      />
    );
  };

  const DotPoint = Point(symbolCircle, {
    strokeWidth: "0px"
  });

  const LineWithDotPoint = props => (
    <React.Fragment>
      <LineSeries.Path {...props} />
      <ScatterSeries.Path {...props} pointComponent={DotPoint} />
    </React.Fragment>
  );

  // const LegendLabel = props => {
  //   const { text } = props;
  //   // console.log(data, props);
  //   return <ValueAxis.Label {...props} text={"Pork"} />;
  // };

  const valueAxisLabel = props => {
    let { text } = props;
    const figure = text.replace(/,/g, "");
    // const label = figure;
    const label = figure === 0 ? "$0" : `$${figure / 1000}k`;
    return (
      <ValueAxis.Label {...props} style={{ fill: "#757575" }} text={label} />
    );
  };

  const rangePadding = 10;

  const timeStart = data[0].argument;
  const timeEnd = data[data.length - 1].argument;

  const rangeStart = moment(timeStart).subtract(rangePadding, "days");
  const rangeEnd = moment(timeEnd).add(rangePadding, "days");

  const modifyArgumentDomain = () => [rangeStart, rangeEnd];
  const modifyValueDomain = () => [15000, 50000];

  return (
    <Paper className="chart">
      <Chart data={data} width={600} height={300}>
        <ArgumentScale
          modifyDomain={modifyArgumentDomain}
          factory={scaleTime}
        />
        <ValueScale modifyDomain={modifyValueDomain} />
        <ArgumentAxis showTicks={false} />
        <ValueAxis
          // factory={scaleTime}
          // tickSize={5}
          // position="left"
          // scaleName="Value scale"
          // indentFromAxis={10}
          // showTicks={false}
          // showGrid={true}
          // showLine={false}
          // showLabels={true}
          labelComponent={valueAxisLabel}
        />
        <LineSeries
          name="Services"
          valueField="value"
          argumentField="argument"
          color={seriesColour}
          seriesComponent={LineWithDotPoint}
        />
        <Title text="Services over time" />
        {/* <Legend position="top" labelComponent={LegendLabel} /> */}
        <Legend position="top" />
        <EventTracker />
        <Tooltip />
      </Chart>
    </Paper>
  );
}

render(<App />, document.getElementById("root"));
