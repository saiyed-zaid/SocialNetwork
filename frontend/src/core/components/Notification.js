import React from "react";
import { read, isFollowStatusChange } from "../api/getNotification";

import Follow from "./getNewFollower";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasNewFollow: false, timer: null, newFollowerList: [] };
  }

  componentDidMount() {
    read()
      .then((data) => {
        console.log("Check__", data);
        var newFollowerList = [];
        if (data.followers.length > 0) {
          //this.setState({ newFollower: new Array(data.followers.length) });

          data.followers.forEach((follower, i) => {
            if (follower.isNewUser) {
              newFollowerList.push({
                id: follower.user._id,
                name: follower.user.name,
                followedFrom: follower.followedFrom,
              });
            }
          });

          if (newFollowerList.length > 0) {
            console.log("NEW FOLLOWER LIST", newFollowerList);

            this.setState({
              hasNewFollow: true,
              newFollowerList: newFollowerList,
            });
          }

          if (this.state.hasNewFollow) {
            //setTimeout(this.followStatusChange, 16000);
          }
        }
      })
      .catch((err) => {
        if (err) {
          console.log("Error while fetching new Followers", err);
        }
      });
  }

  followStatusChange = () => {
    if (this.state.hasNewFollow) {
      isFollowStatusChange();
      const toast = document.querySelectorAll(".noti");
      toast.forEach((t) => {
        t.classList.replace("show", "hide");
      });
      clearTimeout(this.state.timer);
      this.setState({ hasNewFollow: false });
    }
  };

  render() {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link"
          data-toggle="dropdown"
          href="/"
          aria-expanded="false"
        >
          <i className="far fa-bell text-light" />
          <span className="badge badge-warning navbar-badge">
            {this.state.newFollowerList.length}
          </span>
        </a>

        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-left">
          {(this.state.newFollowerList.length > 0 && (
            <>
              <a href="#" className="dropdown-item">
                <span className="float-right text-muted text-sm">
                  <Follow newFollowers={this.state.newFollowerList} />
                </span>
              </a>
            </>
          )) || (
            <span className="dropdown-item dropdown-header">
              No Notifications
            </span>
          )}

          <div className="dropdown-divider" />
        </div>
      </li>
    );
  }
}

export default Notification;
