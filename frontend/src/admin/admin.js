import React, { Component } from "react";
import Posts from "./posts";
import Users from "./users";
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
    /*  if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    } */
    return (
      <div>
        <div className="jumbotron p-3">
          <h4>Home</h4>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
