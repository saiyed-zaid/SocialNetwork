import React, { Component } from "react";
import MainRouter from "./mainRouter";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { signout, isAuthenticated } from "./auth/index";
import Authservice from "./services/auth";
import Postservice from "./services/post";
import Userservice from "./services/user";
import Reportservice from "./services/report";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logginStatus: true,
      warn: false,
    };
  }
  //checking authenication

  logout() {
    // Send a logout request to the API
    if (isAuthenticated()) {
      document.location.reload();
      signout(() => {});
      this.setState({ logginStatus: false });
    }
    // this.destroy(); // Cleanup
  }

  render() {
    return (
      <Router>
        <MainRouter
          Authservice={new Authservice()}
          Postservice={new Postservice()}
          Userservice={new Userservice()}
          Reportservice={new Reportservice()}
          {...this.props}
        />
        {!this.state.logginStatus ? <Redirect to="/signin" /> : null}
      </Router>
    );
  }
}
