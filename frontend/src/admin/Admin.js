import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";
import {
  getNewUsers,
  getNewPosts,
  getDailyActiveUsers,
  getUsersOnlineNow,
} from "./apiAdmin";

class Admin extends Component {
  state = {
    redirectToHome: false,
    error: "",
    newUsers: [],
    newPosts: [],
    dailyActiveUsers: [],
    usersOnline: [],
  };

  getData = (userId, token) => {
    getNewUsers(userId, token)
      .then((data) => {
        if (data.err) {
          this.setState({ error: data.err });
        } else {
          this.setState({ newUsers: data });
        }
      })
      .catch();
    getNewPosts(userId, token)
      .then((data) => {
        if (data.err) {
          this.setState({ error: data.err });
        } else {
          this.setState({ newPosts: data });
        }
      })
      .catch();
    getDailyActiveUsers(userId, token)
      .then((data) => {
        if (data.err) {
          this.setState({ error: data.err });
        } else {
          this.setState({ dailyActiveUsers: data });
        }
      })
      .catch();

    getUsersOnlineNow(userId, token)
      .then((data) => {
        if (data.err) {
          this.setState({ error: data.err });
        } else {
          this.setState({ usersOnline: data });
        }
      })
      .catch();
  };
  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;
    if (isAuthenticated().user.role !== "admin") {
      this.setState({ redirectToHome: true });
    }
    this.getData(userId, token);
    this.interval = setInterval(() => this.getData(userId, token), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { newUsers, newPosts, dailyActiveUsers, usersOnline } = this.state;
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <div className="jumbotron p-3">
          <h4> Dashboard</h4>
        </div>
        <div className="container-fluid ">
          <div className="row justify-content-md-center">
            <div className="dash-card bg-success p-3">
              <h3>New Registrations</h3>
              <h1>
                {newUsers.length}
                &nbsp;
              </h1>
              <i className="fas fa-user dash-icon"></i>
            </div>
            <div className="dash-card bg-warning p-3">
              <h3>New Posts</h3>
              <h1>
                {newPosts.length}
                &nbsp;
              </h1>
              <i className="fas fa-list-alt dash-icon"></i>
            </div>
            <div
              className="dash-card p-3"
              style={{ backgroundColor: "#17a2b8" }}
            >
              <h3>Active Today</h3>
              <h1>
                {dailyActiveUsers.length}
                &nbsp;
              </h1>
              <i className="fas fa-user-check dash-icon"></i>
            </div>
            <div className="dash-card bg-danger p-3">
              <h3>Active Now</h3>
              <h1>{usersOnline.length}&nbsp;</h1>
              <i className="fas fa-eye dash-icon"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
