import React, { Component } from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };
  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };
  render() {
    return (
      <div className="d-inline-block mt-5">
        {!this.props.following ? (
          <button
            onClick={this.followClick}
            className="btn btn-raised btn-success mr-5"
          >
            <i className="fas fa-user-plus"></i>
          </button>
        ) : (
          <button
            onClick={this.unfollowClick}
            className="btn btn-raised btn-danger mr-5"
          >
            <i class="fas fa-user-minus"></i>
          </button>
        )}
      </div>
    );
  }
}
export default FollowProfileButton;
