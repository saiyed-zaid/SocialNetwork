import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { remove } from "./apiUser";
import { Redirect } from "react-router-dom";

class DeleteUser extends Component {
  state = {
    redirect: false
  };

  /**
   * function For Deleteing The User Account
   */
  deleteAccount = () => {
    const token = isAuthenticated().user.token;
    const userId = this.props.userId;
    remove(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        signout(() => console.log("deleted"));
        this.setState({ redirect: true });
      }
    });
  };

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are Youe Sure. You Want To Delete your Acccount?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-default"
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
