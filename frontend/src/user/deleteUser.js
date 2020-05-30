import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
      try {
        const response = await this.props.remove(userId, token);

        if (response.statsu === 200) {
          this.setState({ redirect: true });
        } else {
          console.log(response.msg);
        }
      } catch (error) {}
    } else {
      try {
        const response = await this.props.remove(userId, token);
        if (response.status === 200) {
          signout(() => console.log("deleted"));
          this.setState({ redirect: true });
        } else {
          console.log(data.error);
        }
      } catch (error) {}
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
        <FontAwesomeIcon icon={faTrash} />
      </button>
    );
  }
}

export default DeleteUser;
