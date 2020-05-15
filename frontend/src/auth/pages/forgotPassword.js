import React, { Component } from "react";
import { forgotPassword } from "../index";
import Alert from "../../ui-components/Alert";

class ForgotPassword extends Component {
  state = {
    email: this.props.location.state.email
      ? this.props.location.state.email
      : "",
    message: "",
    error: "",
  };

  forgotPassword = (e) => {
    let sec = 59;
    let m = 2;
    var t = sec.toString();

    const doc = document.querySelector("#t");

    e.preventDefault();
    this.setState({ message: "", error: "" });
    forgotPassword(this.state.email).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ message: data.message });
      }
    });
    let myVar = setInterval(myTimer, 1000);

    function myTimer() {
      sec--;
      if (sec === 0) {
        m--;
        sec = 59;
      }

      if (m < 0) {
        m = "0";
        sec = "00";
        doc.innerHTML = m + ":" + sec;
        clearInterval(myVar);
      }

      if (t.length === 2) {
        doc.innerHTML = "0" + m + ":" + sec;
      } else {
        doc.innerHTML = "0" + m + ":0" + sec;
      }
    }

    //    console.log(doc);
  };

  render() {
    return (
      <div className="container d-flex justify-content-center">
        <div className="card col-md-4 mt-3">
          <h2 className="mt-5 ">Reset Password</h2>
          <h3 id="t"> </h3>
          {this.state.message && (
            <Alert message={this.state.message} type="info" />
          )}
          {this.state.error && (
            <Alert message={this.state.error} type="danger" />
          )}

          <form>
            <div className="form-group mt-5">
              <input
                type="email"
                className="form-control"
                placeholder="Your email address"
                value={this.state.email}
                name="email"
                onChange={(e) =>
                  this.setState({
                    email: e.target.value,
                    message: "",
                    error: "",
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
