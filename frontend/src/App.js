import React, { Component } from "react";
import MainRouter from "./mainRouter";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { signout, isAuthenticated } from "./auth/index";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logginStatus: true,
      warn: false,
    };

    /** Evets TO Check  */
    this.events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];
    this.warn = this.warn.bind(this);
    this.logout = this.logout.bind(this);
    this.resetTimeout = this.resetTimeout.bind(this);

    for (var i in this.events) {
      window.addEventListener(this.events[i], this.resetTimeout);
    }
    this.setTimeout();
  }
  clearTimeout() {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }

  setTimeout() {
    this.warnTimeout = setTimeout(this.warn, 1000 * 1000);
    this.logoutTimeout = setTimeout(this.logout, 1200 * 1000);
  }

  resetTimeout() {
    this.clearTimeout();
    this.setTimeout();
  }

  warn() {
    if (isAuthenticated()) {
      this.setState({ warn: true });
    }
  }

  logout() {
    // Send a logout request to the API
    if (isAuthenticated()) {
      signout(() => {});
      this.setState({ logginStatus: false });
    }
    this.destroy(); // Cleanup
  }
  destroy() {
    this.clearTimeout();

    for (var i in this.events) {
      window.removeEventListener(this.events[i], this.resetTimeout);
    }
  }
  render() {
    return (
      <Router>
        {this.state.warn && <Redirect to="/lockscreen" />}
        {!this.state.logginStatus ? <Redirect to="/signin" /> : null}
        <MainRouter />
      </Router>
    );
  }
}
