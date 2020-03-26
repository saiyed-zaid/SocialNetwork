import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/";
import SocialLogin from "./socialLogin";
import PageLoader from "../components/pageLoader";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "zss@narola.email",
      password: "123456",
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
          <label for="exampleInputEmail1">Email address</label>
          <input
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" for="exampleCheck1">
            Check me out
          </label>
        </div>
        <button
          type="submit"
          onClick={this.clickSubmit}
          className="btn btn-primary w-100"
        >
          Sign In
        </button>

        <div style={{ paddingTop: "5px", color: "black" }}>
          <SocialLogin />
        </div>
      </form>
    );
  };

  render() {
    const { email, password, error, redirectToRefferer, loading } = this.state;
    if (redirectToRefferer) {
      if (isAuthenticated().user.role === "admin") {
        return <Redirect to="/admin/home" />;
      } else {
        return <Redirect to="/" />;
      }
    }
    return (
      <div className="container col-lg-3">
        <div
          className="card  mt-5 p-3"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0.3em 0.3em 0.4em rgba(0,0,0,0.3)"
            /* transition: "none",
            transform: "none" */
          }}
        >
          <div className="card-body p-0 " style={{ display: "block" }}>
            <h4 className="card-title">Sign in</h4>

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
            {loading ? <PageLoader /> : ""}
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
      </div>
    );
  }
}

export default Signin;
