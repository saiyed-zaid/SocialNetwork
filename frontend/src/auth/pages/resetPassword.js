import React, { Component } from "react";
import Alert from "../../ui-components/Alert";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      message: "",
      error: "",
    };
  }

  resetPassword = async (e) => {
    e.preventDefault();
    this.setState({ message: "", error: "" });
    try {
      const data = await this.props.resetPassword({
        newPassword: this.state.newPassword,
        resetPasswordLink: this.props.match.params.resetPasswordToken,
      });
      if (data.message) {
        this.setState({ error: data.message });
      } else {
        this.setState({ message: data.message, newPassword: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Reset your Password</h2>

        {this.state.message && (
          <Alert message={this.state.message} type="success" />
        )}
        {this.state.error && <Alert message={this.state.error} type="danger" />}

        <form className>
          <div className="form-group mt-5">
            <input
              type="password"
              className="form-control"
              placeholder="Your new password"
              value={this.state.newPassword}
              name="newPassword"
              onChange={(e) =>
                this.setState({
                  newPassword: e.target.value,
                  message: "",
                  error: "",
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
