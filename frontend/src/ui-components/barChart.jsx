import React, { Component } from "react";
import Chart from "chart.js";

export default class barChart extends Component {
  constructor() {
    super();
    this.chartRef = React.createRef();
  }

  createChart = () => {
    const ctx = this.chartRef.current.getContext("2d");

    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
      data: {
        labels: this.props.xlabels,
        datasets: [
          {
            label: this.props.title,
            // backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: this.props.values,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                userCallback: function (label, index, labels) {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                    return label;
                  }
                },
              },
            },
          ],
        },
      },
    });
  };
  componentDidMount() {
    this.createChart();
  }
  componentDidUpdate() {
    this.createChart();
  }

  render() {
    return <canvas id="myChart" ref={this.chartRef} />;
  }
}
