import React, { Component } from "react";
import Posts from "../post/posts";
import Users from "../user/users";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";

class Admin extends Component {
  state = {
    redirectToHome: false
  };

  componentDidMount() {
    if (isAuthenticated().user.role !== "admin") {
      this.setState({ redirectToHome: true });
    }
  }
  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <div className="jumbotron p-3">
          <h4>Admin Dashboard</h4>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <hr />
              <div className="jumbotron p-3">
                <h4> Posts</h4>
              </div>
              <Posts />
            </div>
            <div className="col-md-6">
              <hr />
              <Users />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
