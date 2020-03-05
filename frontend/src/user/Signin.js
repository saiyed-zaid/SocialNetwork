import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { signin, authenticate } from "../auth/";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToRefferer: false,
      loading: false
    };
  }

  handleChange = name => event => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };
    signin(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        this.authenticate(data, () => {
          this.setState({ redirectToRefferer: true });
        });
      }
    });
  };

  signinForm = (email, password) => {
    return (
      <form method="post">
        <div className="form-group">
          <label className="bmd-label-floating">Email</label>
          <input
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-floating">Password</label>
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <button
          onClick={this.clickSubmit}
          className="btn btn-raised btn-primary"
        >
          Sign in
          {/*  <span>
            <Spinner />
          </span> */}
        </button>
      </form>
    );
  };

  render() {
    const { email, password, error, redirectToRefferer, loading } = this.state;
    if (redirectToRefferer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container col-lg-3">
        <div
          className="card p-3 mt-5"
          style={{ borderRadius: "5px", boxShadow: "5px 5px 5px lightgrey" }}
        >
          <h2 className="mb-5 mt-4">Signin</h2>
          <div
            className="alert alert-danger alert-dismissible fade show"
            style={{ display: error ? "" : "none" }}
          >
            {error}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {this.signinForm(email, password)}
        </div>
      </div>
    );
  }
}

export default Signin;
