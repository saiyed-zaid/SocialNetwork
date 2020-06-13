import React, { Component } from "react";

import { Bar } from "react-chartjs-2";

export default class yearly extends Component {
  constructor() {
    super();
    this.state = {
      month: "",
      data: [],
    };
  }
  async componentDidMount() {
    const response = await this.props.getDailyFollower(
      this.props.authUser.token
    );
    console.log("response", response);

    try {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log(response.data);

        const name = [];
        const values = [];
        response.data.map((day) => name.push(day.name));
        response.data.map((day) => values.push(day.amt));
        var chartData = {
          labels: name,
          datasets: [
            {
              data: values,
            },
          ],
        };
        this.setState({ data: chartData });
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const { data } = this.state;
    return (
      <>
        <div className="text-dark">
          <Bar data={data} width={100} height={50} />
        </div>
      </>
    );
  }
}
