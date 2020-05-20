import React from "react";
import { Link } from "react-router-dom";
import Recaptcha from "react-recaptcha";
import Alert from "../../ui-components/Alert";
import moment from "moment";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      day: 0,
      month: 0,
      year: 0,
      errors: {},
      responseError: null,
      recatcha: false,
      error: "",
      dob: "",
    };

    this.postData = new FormData();
  }

  handleInputChange = (event) => {
    this.postData.set(event.target.name, event.target.value);

    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  diff_years = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 24;
    return Math.abs(Math.round(diff / 365.25));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(this.state.dob);

    const date1 = new Date();
    const date2 = new Date(this.state.dob);
    const dobValidate = this.diff_years(date1, date2);

    if (dobValidate > 18) {
      if (this.state.recatcha) {
        try {
          this.setState({ errors: {}, error: "" });
          await this.props.registerUser(this.state);
          this.props.history.push("/signin");
        } catch (errors) {
          this.setState({
            errors,
          });
        }
      } else {
        this.setState({ errors: { captcha: "Captcha Invalid" } });
      }
    } else {
      this.setState({ errors: { dob: "User  Must Be Atleast 18 Years Old" } });
    }
  };

  /*  getYearDropList = () => {
    const year = new Date().getFullYear();
    return Array.from(new Array(50), (v, i) => (
      <option key={i} value={year - i}>
        {year - i}
      </option>
    ));
  };
  getMonthDropList = () => {
    const mlist = [
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
    ];
    return Array.from(new Array(12), (v, i) => (
      <option key={i} value={i + 1}>
        {mlist[i]}
      </option>
    ));
  };

  getDayDropList = () => {
    //const year = new Date().getFullYear();
    return Array.from(new Array(31), (v, i) => (
      <option key={i} value={i + 1}>
        {i + 1}
      </option>
    ));
  }; */

  callback = () => {};

  verifyCallback = (response) => {
    this.setState({ recatcha: true });
  };

  render() {
    return (
      <div
        className="container col-md-4 my-3"
        style={{ backgroundColor: "#343a40" }}
      >
        <div className="jumbotron text-light">
          {this.state.responseError && (
            <Alert message={this.state.responseError} type="danger" />
          )}
          <h2>Signup</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Name</label>
              <input
                type="text"
                name="name"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["name"] && "is-invalid"
                }`}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />

              {this.state.errors["name"] && (
                <div className="invalid-feedback">
                  {this.state.errors["name"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                name="email"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["email"] && "is-invalid"
                }`}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />

              {this.state.errors["email"] && (
                <div className="invalid-feedback">
                  {this.state.errors["email"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="password"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["password"] && "is-invalid"
                }`}
                id="exampleInputPassword1"
              />

              {this.state.errors["password"] && (
                <div className="invalid-feedback">
                  {this.state.errors["password"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["password_confirmation "] && "is-invalid"
                }`}
                id="exampleInputPassword1"
              />

              {this.state.errors["password_confirmation "] && (
                <div className="invalid-feedback">
                  {this.state.errors["password_confirmation "]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="inputCity">Birthday</label>
            </div>
            <div className="form-row">
              {/* <div className="form-group col-md-4">
                <select
                  id="inputState"
                  className="form-control"
                  name="day"
                  onChange={this.handleInputChange}
                >
                  <option value="0" selected>
                    Day
                  </option>
                  {this.getDayDropList()}
                </select>
              </div>
              <div className="form-group col-md-4">
                <select
                  id="inputState"
                  className="form-control"
                  name="month"
                  onChange={this.handleInputChange}
                >
                  <option value="0" selected>
                    Month
                  </option>
                  {this.getMonthDropList()}
                </select>
              </div>
              <div className="form-group col-md-4">
                <select
                  id="inputState"
                  className="form-control"
                  name="year"
                  onChange={this.handleInputChange}
                >
                  <option value="0" selected>
                    Year
                  </option>
                  {this.getYearDropList()}
                </select>
              </div> */}
              <div className="form-group col-md-12">
                <input
                  className={`form-control ${
                    this.state.errors.dob && "is-invalid"
                  }`}
                  type="date"
                  name="dob"
                  id="dob"
                  onChange={this.handleInputChange}
                />

                {this.state.errors.dob && (
                  <div className="invalid-feedback">
                    {this.state.errors.dob}
                  </div>
                )}
              </div>
            </div>
            <div className="row justify-content-md-start m-1">
              <div className="col">
                <Recaptcha
                  sitekey="6LeOafkUAAAAANf_yLofQU5wx-hiEarcQbrgniO5"
                  render="explicit"
                  onloadCallback={this.callback}
                  verifyCallback={this.verifyCallback}
                  theme="dark"
                  size="normal"
                />
                <span
                  className={` ${this.state.errors.captcha && "is-invalid"}`}
                ></span>
                {this.state.errors.captcha && (
                  <div className="invalid-feedback">
                    {this.state.errors.captcha}
                  </div>
                )}
                {/* {this.state.error ? (
                <Alert type="danger" message={this.state.error} />
              ) : null} */}
              </div>
            </div>

            <div className="row">
              <div className="col">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="col">
                <Link
                  className="stretched-link"
                  to="/signin"
                  style={{ color: "unset" }}
                >
                  Login Instead
                </Link>
              </div>
            </div>

            <hr className="my-4" />
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
