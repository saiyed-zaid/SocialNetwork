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
      <div className="row pt-1 p-0 m-0">
        <div className="col-3 bg-dark p-0">
          <div
            className="accordion"
            id="accordionExample"
            style={{ minHeight: "89vh" }}
          >
            <div className="card border-0  bg-dark">
              <div className="card-header" id="headingOne">
                <h2 className="mb-0">
                  <span
                    className="btn-link"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Followers
                  </span>
                </h2>
              </div>
              <div
                id="collapseOne"
                className="collapse"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <div
                    className="nav flex-column nav-pills text-center"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <a
                      className="nav-link active "
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
                      className="nav-link "
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
                      className="nav-link"
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
                      className="nav-link "
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
              </div>
            </div>
            {/*   <div className="card">
              <div className="card-header" id="headingTwo">
                <h2 className="mb-0">
                  <button
                    className="btn btn-link btn-block text-left collapsed btn-accordian"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Likes{" "}
                  </button>
                </h2>
              </div>
              <div
                id="collapseTwo"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <div
                    className="nav flex-column nav-pills text-center"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <a
                      className="nav-link active "
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
                      className="nav-link "
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
                      className="nav-link"
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
                      className="nav-link "
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
              </div>
            </div>
            <div className="card">
              <div className="card-header" id="headingThree">
                <h2 className="mb-0">
                  <button
                    className="btn btn-link btn-block text-left collapsed btn-accordian "
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Comments{" "}
                  </button>
                </h2>
              </div>
              <div
                id="collapseThree"
                className="collapse"
                aria-labelledby="headingThree"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <div
                    className="nav flex-column nav-pills text-center"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <a
                      className="nav-link active "
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
                      className="nav-link "
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
                      className="nav-link"
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
                      className="nav-link "
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
              </div>
            </div>
         */}{" "}
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
                getYearlyFollower={this.props.getYearlyFollower}
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
                getMonthlyFollower={this.props.getMonthlyFollower}
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
                getDailyFollower={this.props.getDailyFollower}
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
