import React, { Component } from "react";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BarChart from "../ui-components/barChart";

export default class BetweenDates extends Component {
  constructor() {
    super();
    this.state = {
      month: "",
      data: [],
      xlabels: null,
      chartValues: null,
      startDate: null,
      endDate: null,
    };
  }

  selectDates = async () => {
    try {
      const response = await this.props.getFollowerBetweenDates(
        this.state.startDate,
        this.state.endDate,
        this.props.authUser.token
      );
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        const name = [];
        const values = [];
        response.data.map((date) => name.push(date.date));
        response.data.map((value) => values.push(value.numberOfFollower));

        this.setState({ xlabels: name, chartValues: values });
      }
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {}
  render() {
    const { date, xlabels, chartValues, startDate, endDate } = this.state;

    return (
      <>
        <div className="form-group">
          <DateTimePicker
            selected={startDate}
            onChange={(date) => {
              this.setState({ startDate: date });
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
          />
          <DateTimePicker
            selected={endDate}
            onChange={(date) => {
              this.setState({ endDate: date });
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-control"
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={this.selectDates}>
            Submit
          </button>
        </div>
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
