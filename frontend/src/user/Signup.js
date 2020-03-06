import React, { Component } from "react";
import { Link } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { signup } from "../auth/";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      loading: ""
    };
  }

  handleChange = name => event => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password
    };
    signup(user).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: false
        });
      }
    });
  };

  signupForm = (name, email, password) => {
    return (
      <form method="post">
        <div className="form-group">
          <label className="bmd-label-floating">Name</label>
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </div>

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
          Sign Up
        </button>
      </form>
    );
  };

  render() {
    const { name, email, password, error, open, loading } = this.state;

    return (
      <div className="container col-lg-3">
        <div
          className="card p-3 mt-5"
          style={{ borderRadius: "5px", boxShadow: "5px 5px 5px lightgrey" }}
        >
          <h2 className="mb-5 mt-4">Signup</h2>
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
          <div
            className="alert alert-success alert-dismissible fade show"
            style={{ display: open ? "" : "none" }}
          >
            New Account Is Successfully Created. Please
            <Link to="/signin">Sign In</Link>.
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {/*  {loading ? <Spinner /> : ""} */}
          {this.signupForm(name, email, password)}
        </div>
      </div>
    );
  }
}

export default Signup;
