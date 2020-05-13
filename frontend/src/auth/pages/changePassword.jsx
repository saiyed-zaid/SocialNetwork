import React from "react";
import { Link, Redirect } from "react-router-dom";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: "",
      password: "",
      password_confirmation: "",
      errors: {},
      responseError: null,
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

    try {
      this.setState({ errors: {} });

      const oldPassword = this.postData.get("oldPassword");
      const password = this.postData.get("password");
      const password_confirmation = this.postData.get("password_confirmation");

      const response = await this.props.changePassword(
        {
          oldPassword,
          password,
          password_confirmation,
        },
        this.props.authUser.token
      );
      if (response.errors) {
        const formattedErrors = {};
        response.errors.forEach((error) => {
          formattedErrors[error.param] = error.msg;
        });
        this.setState({
          errors: formattedErrors,
        });
        // console.log("result__", response);
        // console.log("Formatted__", formattedErrors);
      } else {
        this.props.history.push(`/user/${this.props.authUser._id}`);
      }
    } catch (errors) {
      this.setState({
        errors,
      });
    }
  };

  render() {
    return (
      <div className="container bg-light p-2 my-3 col-md-4">
        <div className="jumbotron" style={{ padding: "0.5rem 2rem" }}>
          {this.state.responseError && (
            <div className="alert alert-danger" role="alert">
              {this.state.responseError}
            </div>
          )}
          <h2>Change Password</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["oldPassword"] && "is-invalid"
                }`}
                id="oldPassword"
              />

              {this.state.errors["oldPassword"] && (
                <div className="invalid-feedback">
                  {this.state.errors["oldPassword"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">New Password</label>
              <input
                type="password"
                name="password"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["password"] && "is-invalid"
                }`}
                id="password"
              />

              {this.state.errors["password"] && (
                <div className="invalid-feedback">
                  {this.state.errors["password"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors.password_confirmation && "is-invalid"
                }`}
                id="password_confirmation"
              />

              {this.state.errors.password_confirmation && (
                <div className="invalid-feedback">
                  {this.state.errors.password_confirmation}
                </div>
              )}
            </div>

            <div className="row">
              <div className="col">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>

            <hr className="my-4" />
          </form>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
