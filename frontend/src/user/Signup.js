import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { signup } from "../auth/";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      loading: "",
      redirectToSignin: false
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
    if (this.isValid()) {
      const { name, email, password } = this.state;
      const user = {
        name: name,
        email: email,
        password: password
      };
      signup(user).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            error: data.msg ? data.msg : "",
            name: "",
            email: "",
            password: "",
            open: false,
            redirectToSignin: true
          });
        }
      });
    }
  };

  isValid = () => {
    const { name, email, password } = this.state;

    if (name.length === 0) {
      this.setState({ error: "Name Is Required", loading: true });
      return false;
    }
    if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
      this.setState({ error: "A Valid Email Is Required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "password Must be 6 character Long",
        loading: false
      });
      return false;
    }
    return true;
  };

  /**
   * Function For Creating Controls For Sign Un form
   *
   * @param {string} name  Name Of The User
   * @param {string} email  Email Of The User
   * @param {string} password Password Of the User
   */
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
    const {
      name,
      email,
      password,
      error,
      open,
      loading,
      redirectToSignin
    } = this.state;
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
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
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            ""
          )}
          {this.signupForm(name, email, password)}
        </div>
      </div>
    );
  }
}

export default Signup;
