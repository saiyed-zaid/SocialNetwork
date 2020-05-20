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
      <div className="row justify-content-center">
        <div className="form-group">
          {!this.props.following ? (
            <button
              type="button"
              onClick={this.followClick}
              className="btn btn-primary btn-sm mr-1"
            >
              Follow
            </button>
          ) : (
            <button
              type="button"
              onClick={this.unfollowClick}
              className="btn btn-primary btn-sm mr-1"
            >
              Unfollow
            </button>
          )}
          <button
            type="button"
            onClick={this.props.handleChatBoxDisplay}
            className="btn btn-secondary btn-sm"
          >
            Message
          </button>
        </div>
      </div>
    );
  }
}
export default FollowProfileButton;
