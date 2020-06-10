import React, { Component } from "react";
import Monthly from "./monthly";
import Yearly from "./yearly";
import Daily from "./daily";

export default class index extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="row pt-1 pr-0 mr-0">
        <div className="col-3 bg-dark p-0">
          <div
            className="nav flex-column nav-pills text-center"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
            style={{ height: "89vh" }}
          >
            <a
              className="nav-link active text-light"
              id="v-pills-home-tab"
              data-toggle="pill"
              href="#v-pills-monthly"
              role="tab"
              aria-controls="v-pills-monthly"
              aria-selected="true"
            >
              yearly
            </a>
            <a
              className="nav-link text-light"
              id="v-pills-yearly-tab"
              data-toggle="pill"
              href="#v-pills-yearly"
              role="tab"
              aria-controls="v-pills-yearly"
              aria-selected="false"
            >
              Monthly
            </a>
            <a
              className="nav-link text-light"
              id="v-pills-Daily-tab"
              data-toggle="pill"
              href="#v-pills-Daily"
              role="tab"
              aria-controls="v-pills-Daily"
              aria-selected="false"
            >
              Daily
            </a>
            <a
              className="nav-link text-light"
              id="v-pills-between-tab"
              data-toggle="pill"
              href="#v-pills-between"
              role="tab"
              aria-controls="v-pills-between"
              aria-selected="false"
            >
              Between Dates
            </a>
          </div>
        </div>
        <div className="col-9">
          <div className="tab-content insights-tab" id="v-pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="v-pills-monthly"
              role="tabpanel"
              aria-labelledby="v-pills-monthly-tab"
            >
              <Yearly
                getYearlyReport={this.props.getYearlyReport}
                authUser={this.props.authUser}
              />
            </div>
            <div
              className="tab-pane fade"
              id="v-pills-yearly"
              role="tabpanel"
              aria-labelledby="v-pills-yearly-tab"
            >
              <Monthly
                getMonthlyReport={this.props.getMonthlyReport}
                authUser={this.props.authUser}
              />
            </div>
            <div
              className="tab-pane fade"
              id="v-pills-Daily"
              role="tabpanel"
              aria-labelledby="v-pills-Daily-tab"
            >
              <Daily
                getDailyReport={this.props.getDailyReport}
                authUser={this.props.authUser}
              />
            </div>
            <div
              className="tab-pane fade"
              id="v-pills-between"
              role="tabpanel"
              aria-labelledby="v-pills-between-tab"
            >
              d
            </div>
          </div>
        </div>
      </div>
    );
  }
}
