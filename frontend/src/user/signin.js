import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/";
import SocialLogin from "./socialLogin";
import {
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Typography
} from "@material-ui/core";

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
          <TextField
            id="outlined-basic"
            label="Email"
            size="small"
            fullWidth
            variant="outlined"
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
          />
        </div>

        <div className="form-group">
          <TextField
            id="outlined-basic"
            label="Password"
            size="small"
            fullWidth
            variant="outlined"
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={this.clickSubmit}
          // className="btn btn-raised btn-primary w-100"
        >
          Sign in
        </Button>
        <div style={{ paddingTop: "5px" }}>
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
        <Card style={{ marginTop: "30px" }}>
          <CardContent>
            <Typography
              style={{ padding: "10%" }}
              component="h4"
              variant="h4"
              color="textSecondary"
              gutterBottom
            >
              Sign In
            </Typography>
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
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Signin;
