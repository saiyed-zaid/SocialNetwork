/* import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";
import { isAuthenticated, signin, authenticate } from "../index";

export default class lockScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: isAuthenticated().user.email,
      password: "",
      redirectToRefferer: false,
      error: "",
      loading: false,
    };
  }
  componentDidMount() {}
  checkPassword = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };

    signin(user)
      .then((data) => {
        if (data.err) {
          this.setState({ error: data.err, loading: false });
        } else {
          authenticate(data, () => {
            this.setState({ redirectToRefferer: true });
          });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };
  render() {
    const { redirectToRefferer } = this.state;

    if (redirectToRefferer) {
      if (isAuthenticated().user.role === "admin") {
        return <Redirect to="/admin/home" />;
      } else {
        return <Redirect to="/" />;
      }
    }
    return (
      <div className="container-fluid p-0 m-0">
        <div className="lockscreen">
          <div className="lockscreen-logo">
            <Link style={{ color: "rgb(61, 97, 251)" }} to="">
              <b>Social Network</b>
            </Link>
          </div>
          <div className="lockscreen-name text-light">
            {isAuthenticated().user.name}
          </div>
          <div className="lockscreen-item">
            <div className="lockscreen-image">
              <img src={DefaultProfile} alt="user" />
            </div>
            <form className="lockscreen-credentials">
              <div className="input-group">
                <input
                  onChange={this.handleChange("password")}
                  type="password"
                  className="form-control"
                  placeholder="password"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn"
                    onClick={this.checkPassword}
                  >
                    <i className="fas fa-arrow-right text-muted" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="help-block text-center text-danger">
            Enter your password to retrieve your session
          </div>
          <div className="text-center ">
            <Link className="text-danger" to="/signin">
              Or sign in as a different user
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
 */
