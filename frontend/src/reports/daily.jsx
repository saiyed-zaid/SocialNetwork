import React, { Component } from "react";

import BarChart from "../ui-components/barChart";

export default class yearly extends Component {
  constructor() {
    super();
    this.state = {
      month: "",
      data: [],
      xlabels: null,
      chartValues: null,
    };
  }
  async componentDidMount() {
    try {
      const response = await this.props.getDailyFollower(
        this.props.authUser.token
      );
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log(response.data);

        const name = [];
        const values = [];
        response.data.map((day) => name.push(day.day));
        response.data.map((day) => values.push(day.followersCount));
        this.setState({ xlabels: name, chartValues: values });
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const { xlabels, chartValues } = this.state;
    return (
      <>
        <div className="text-dark">
          <BarChart
            xlabels={xlabels}
            title="Daily Followers"
            values={chartValues}
          />{" "}
        </div>
      </>
    );
  }
}
