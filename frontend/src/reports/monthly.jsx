import React, { Component } from "react";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  selectMonth = async (date) => {
    this.setState({ date: date });
    try {
      const response = await this.props.getMonthlyFollower(
        date.getFullYear(),
        date.getMonth() + 1,
        this.props.authUser.token
      );
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        const name = [];
        const values = [];
        response.data.map((day) => name.push(day.day));
        response.data.map((day) => values.push(day.followersCount));
        this.setState({ xlabels: name, chartValues: values });
      }
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {}
  render() {
    const { date, xlabels, chartValues } = this.state;

    return (
      <>
        <DateTimePicker
          className="form-control"
          selected={date}
          onChange={(date) => this.selectMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="Select Month"
        />
        <div className="text-dark">
          <BarChart
            xlabels={xlabels}
            title="Monthly Followers"
            values={chartValues}
          />
        </div>
      </>
    );
  }
}
