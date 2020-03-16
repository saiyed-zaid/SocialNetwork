import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { signin, authenticate } from "../auth/";
import SocialLogin from "./SocialLogin";
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

  /**
   * Fuction For Handling Onchange Events On Controls
   *
   *  @param {string} name   Name Of The Control
   */
  handleChange = name => event => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  /**
   *Function For Handling Submition Of Form
   */
  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password
    };

    signin(user).then(data => {
      if (data.msg) {
        this.setState({ error: data.msg, loading: false });
      } else {
        authenticate(data, () => {
          this.setState({ redirectToRefferer: true });
        });
      }
    });
  };

  /**
   * Function For Creating Controls For Sign In form
   *
   * @param {string} email  Email Of The User
   * @param {string} password Password Of the User
   */
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
        </button>
        <SocialLogin />
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
          className="card mt-5 p-3 "
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0.3em 0.3em 0.4em rgba(0,0,0,0.3)"
          }}
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
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            ""
          )}
          {this.signinForm(email, password)}

          <Link
            to={{
              pathname: "/forgot-password",
              state: {
                email: email
              }
            }}
            className="text-danger"
          >
            Forgot Password ?
          </Link>
        </div>
      </div>
    );
  }
}

export default Signin;
