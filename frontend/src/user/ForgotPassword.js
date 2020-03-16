import React, { Component } from "react";
import { forgotPassword } from "../auth";

class ForgotPassword extends Component {
  state = {
    email: this.props.location.state.email
      ? this.props.location.state.email
      : "",
    message: "",
    error: ""
  };

  forgotPassword = e => {
    e.preventDefault();
    this.setState({ message: "", error: "" });
    forgotPassword(this.state.email).then(data => {
      console.log("data___", data);
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ message: data.message });
      }
    });
  };

  render() {
    return (
      <div className="container d-flex justify-content-center">
        <div className="card col-md-4 mt-3">
          <h2 className="mt-5 ">Reset Password</h2>

          {this.state.message && (
            <h4 className="bg-success">{this.state.message}</h4>
          )}
          {this.state.error && (
            <h4 className="bg-warning">{this.state.error}</h4>
          )}

          <form>
            <div className="form-group mt-5">
              <input
                type="email"
                className="form-control"
                placeholder="Your email address"
                value={this.state.email}
                name="email"
                onChange={e =>
                  this.setState({
                    email: e.target.value,
                    message: "",
                    error: ""
                  })
                }
                autoFocus
              />
            </div>

            <button
              onClick={this.forgotPassword}
              className="btn btn-raised btn-primary"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
