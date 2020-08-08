import React, { Component } from "react";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
import BarChart from "../ui-components/barChart";

export default class Yearly extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      data: [],
      xlabels: null,
      chartValues: null,
    };
  }

  selectYear = async (date) => {
    this.setState({ date: date });
    try {
      const response = await this.props.getYearlyFollower(
        date.getFullYear(),
        this.props.authUser.token
      );
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        const values = [];
        response.data.map((year) => values.push(year.followersCount));
        this.setState({
          xlabels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          chartValues: values,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { date, xlabels, chartValues } = this.state;

    return (
      <div>
        <div>
          <DateTimePicker
            className="form-control"
            selected={date}
            onChange={(date) => {
              this.selectYear(date);
            }}
            showYearPicker
            dateFormat="yyyy"
            placeholderText="Select Year"
          />
        </div>
        <div className="text-dark">
          <BarChart
            xlabels={xlabels}
            title="Yearly Followers"
            values={chartValues}
          />
        </div>
      </div>
    );
  }
}
