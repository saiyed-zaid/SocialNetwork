import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { Redirect } from "react-router-dom";

class DeleteUser extends Component {
  state = {
    redirect: false,
  };

  /**
   * function For Deleteing The User Account
   */
  deleteAccount = async () => {
    const token = isAuthenticated().user.token;
    const userId = this.props.userId;

    if (isAuthenticated().user.role === "admin") {
      const response = await this.props.remove(userId, token);

      if (response.isDeleted) {
        this.setState({ redirect: true });
      } else {
        console.log(response.msg);
      }
    } else {
      const response = await this.props.remove(userId, token);
      if (response.error) {
        console.log(data.error);
      } else {
        signout(() => console.log("deleted"));
        this.setState({ redirect: true });
      }
    }
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
        className="btn btn-outline-secondary btn-custom"
      >
        Delete Profile &nbsp;
        <i className="fas fa-trash"></i>
      </button>
    );
  }
}

export default DeleteUser;
