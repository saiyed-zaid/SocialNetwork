import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";
import {
  getNewUsers,
  getNewPosts,
  getDailyActiveUsers,
  getUsersOnlineNow,
} from "./apiAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserCheck,
  faListAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
class Admin extends Component {
  state = {
    redirectToHome: false,
    error: "",
    newUsers: [],
    newPosts: [],
    dailyActiveUsers: [],
    usersOnline: [],
  };

  getData = async (userId, token) => {
    try {
      const response = await getNewUsers(userId, token);
      if (response.data.err) {
        this.setState({ error: response.data.err });
      } else {
        this.setState({ newUsers: response.data });
      }
    } catch (error) {}

    try {
      const response = await getNewPosts(userId, token);
      if (response.data.err) {
        this.setState({ error: response.data.err });
      } else {
        this.setState({ newPosts: response.data });
      }
    } catch (error) {}

    try {
      const response = await getDailyActiveUsers(userId, token);
      if (response.data.err) {
        this.setState({ error: response.data.err });
      } else {
        this.setState({ dailyActiveUsers: response.data });
      }
    } catch (error) {}

    try {
      const response = await getUsersOnlineNow(userId, token);

      if (response.data.err) {
        this.setState({ error: response.data.err });
      } else {
        this.setState({ usersOnline: response.data });
      }
    } catch (error) {}
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
              <FontAwesomeIcon icon={faUser} className="dash-icon" />
            </div>
            <div className="dash-card bg-warning p-3">
              <h3>New Posts</h3>
              <h1>
                {newPosts.length}
                &nbsp;
              </h1>
              <FontAwesomeIcon icon={faListAlt} className="dash-icon" />
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
              <FontAwesomeIcon icon={faUserCheck} className="dash-icon" />
            </div>
            <div className="dash-card bg-danger p-3">
              <h3>Active Now</h3>
              <h1>{usersOnline.length}&nbsp;</h1>
              <FontAwesomeIcon icon={faEye} className="dash-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
