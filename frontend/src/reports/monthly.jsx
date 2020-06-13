import React, { Component } from "react";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
export default class yearly extends Component {
  constructor() {
    super();
    this.state = {
      month: "",
      data: [],
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
        console.log(response);
        const name = [];
        const values = [];
        response.data.map((day) => name.push(day.day));
        response.data.map((day) => values.push(day.followersCount));
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
  };
  render() {
    const { month, data } = this.state;
    return (
      <>
        <DateTimePicker
          className="form-control"
          selected={month}
          onChange={(date) => this.selectMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="Select Month"
        />
        <div className="text-dark">
          {" "}
          <Bar data={data} width={100} height={50} />
        </div>
      </>
    );
  }
}
