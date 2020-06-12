import React from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./socialLogin";
import Alert from "../../ui-components/Alert";

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {},
      responseError: null,
      isLoading: false,
    };

    this.postData = new FormData();
  }

  handleInputChange = (event) => {
    this.postData.set(event.target.name, event.target.value);

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      this.setState({ errors: {}, responseError: null });

      const response = await this.props.loginUser(this.state);

      if (response.statusCode === 422) {
        this.setState({ responseError: response.msg, isLoading: false });
      } else {
        localStorage.setItem("jwt", JSON.stringify(response.data));
        this.props.handleAuthUserUpdate();
        this.setState({ isLoading: false });
        response.data.user.role === "admin"
          ? this.props.history.push("/admin/home")
          : this.props.history.push("/");
      }
    } catch (errors) {
      this.setState({ errors, isLoading: false });
    }
  };

  render() {
    const { isLoading } = this.state;
    return (
      <div
        className="container col-md-4 my-3"
        style={{ backgroundColor: "#343a40" }}
      >
        <div className="jumbotron text-light">
          {this.state.responseError && (
            <Alert type="danger" message={this.state.responseError} />
          )}
          <h2>Login</h2>
          <form onSubmit={this.handleSubmit}>
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
              <label htmlFor="exampleInputPassword1">
                <Link
                  to={{
                    pathname: "/forgot-password",
                    state: {
                      email: this.state.email,
                    },
                  }}
                  className="text-light"
                >
                  Forgot Password ?
                </Link>
              </label>
            </div>

            <div className="row">
              <div className="col">
                {isLoading ? (
                  <button type="submit" className="btn btn-primary" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                )}
              </div>

              <div className="col">
                <Link
                  className="stretched-link"
                  to="/signup"
                  style={{ color: "unset" }}
                >
                  Create Account
                </Link>
              </div>
            </div>

            <hr className="my-4" />
            <div className="form-group">
              <SocialLogin
                socialLogin={this.props.socialLogin}
                authenticate={this.props.authenticate}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Signin;
