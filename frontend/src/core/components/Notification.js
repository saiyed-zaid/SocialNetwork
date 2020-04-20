import React from "react";
import { read, isFollowStatusChange } from "../api/getNotification";

import Follow from "./getNewFollower";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasNewFollow: false, timer: null, newFollower: [] };
  }
  componentDidMount() {
    read()
      .then((data) => {
        if (data.followers.length > 0) {
          this.setState({ newFollower: new Array(data.followers.length) });
          data.followers.forEach((follower, i) => {
            if (follower.isNewUser) {
              this.setState({ hasNewFollow: true });
              this.setState((state) => this.state.newFollower.push(follower));
            }
          });
          if (this.state.hasNewFollow) {
            setTimeout(this.followStatusChange, 16000);
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
    return <Follow test={this.state.newFollower} />;
  }
}

export default Notification;
