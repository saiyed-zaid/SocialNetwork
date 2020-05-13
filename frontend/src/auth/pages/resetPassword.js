import React, { Component } from "react";
import { resetPassword } from "../index";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      message: "",
      error: ""
    };
  }

  resetPassword = e => {
    e.preventDefault();
    this.setState({ message: "", error: "" });

    resetPassword({
      newPassword: this.state.newPassword,
      resetPasswordLink: this.props.match.params.resetPasswordToken
    }).then(data => {

      if (data.message) {
        this.setState({ error: data.message });
      } else {
        this.setState({ message: data.message, newPassword: "" });
      }
    });
  };

  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Reset your Password</h2>

        {this.state.message && (
          <div
            className="alert alert-success alert-dismissible fade show"
            style={{ display: this.state.message ? "" : "none" }}
          >
            {this.state.message}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        {this.state.error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            style={{ display: this.state.message ? "" : "none" }}
          >
            {this.state.message}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}

        <form>
          <div className="form-group mt-5">
            <input
              type="password"
              className="form-control"
              placeholder="Your new password"
              value={this.state.newPassword}
              name="newPassword"
              onChange={e =>
                this.setState({
                  newPassword: e.target.value,
                  message: "",
                  error: ""
                })
              }
              autoFocus
            />
          </div>
          <button
            onClick={this.resetPassword}
            className="btn btn-raised btn-primary"
          >
            Reset Password
          </button>
        </form>
      </div>
    );
  }
}

export default ResetPassword;
