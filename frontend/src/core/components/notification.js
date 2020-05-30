import React from "react";
import {
  newFollowersList,
  /* isFollowStatusChange */ readPost,
} from "../api/getNotification";

import Follow from "./getNewFollower";
import { isAuthenticated } from "../../auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasNewFollow: false,
      timer: null,
      newFollowerList: [],
      hasNewLikes: false,
      newLikesList: [],
      hasNewComment: false,
      newCommentList: [],
    };
  }

  async componentDidMount() {
    //New Follower List

    newFollowersList().then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("jwt");
      }
      var newFollowerList = [];
      if (response.data.length > 0) {
        response.data.forEach((follower, i) => {
          newFollowerList.push({
            id: follower.user._id,
            name: follower.user.name,
            followedFrom: follower.followedFrom,
          });
        });
      }

      if (newFollowerList.length > 0) {
        this.setState({
          hasNewFollow: true,
          newFollowerList: newFollowerList,
        });
      }
    });

    try {
      readPost().then((response) => {
        console.log("data_", response);
        let newLikesList = [];
        let newCommentsList = [];
        if (response.status === 401) {
          localStorage.removeItem("jwt");

          return;
        }
        if (response.data.length > 0) {
          response.data.forEach((post) => {
            //Likes Notification
            post.likes.forEach((like, i) => {
              if (like.user._id !== isAuthenticated().user._id) {
                newLikesList.push({
                  id: like.user._id,
                  postId: post._id,
                  name: like.user.name,
                  likedFrom: like.likedFrom,
                });
              }
            });

            //Comment Notification
            post.comments.forEach((comment, i) => {
              if (comment.postedBy._id !== isAuthenticated().user._id) {
                newCommentsList.push({
                  id: comment.postedBy._id,
                  postId: post._id,
                  name: comment.postedBy.name,
                  commentedFrom: comment.created,
                });
              }
            });

            if (newLikesList.length > 0 || newCommentsList.length > 0) {
              this.setState({
                hasNewComment: true,
                newCommentList: newCommentsList,
                hasNewLikes: true,
                newLikesList: newLikesList,
              });
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  /* likeStatusChange = () => {
    if (this.state.hasNewLikes) {
      const toast = document.querySelectorAll(".noti");
      toast.forEach((t) => {
        t.classList.replace("show", "hide");
      });
      clearTimeout(this.state.timer);
      this.setState({ hasNewLikes: false });
    }
  }; followStatusChange = () => {
    if (this.state.hasNewFollow) {
      isFollowStatusChange();
      const toast = document.querySelectorAll(".noti");
      toast.forEach((t) => {
        t.classList.replace("show", "hide");
      });
      clearTimeout(this.state.timer);
      this.setState({ hasNewFollow: false });
    }
  }; */

  render() {
    return (
      <li className="nav-item dropdown float-right">
        <a
          className="nav-link "
          href="/"
          id="navbarDropdownMenuLink"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <FontAwesomeIcon icon={faBell} />
          {this.state.newFollowerList.length > 0 ||
          this.state.newLikesList.length > 0 ||
          this.state.newCommentList.length > 0 ? (
            <span className="badge badge-warning ml-1">
              {this.state.newFollowerList.length +
                this.state.newLikesList.length +
                this.state.newCommentList.length}
            </span>
          ) : null}
        </a>

        <div className="dropdown-menu dropdown-menu-lg-right noti-toggle">
          {((this.state.newFollowerList.length > 0 ||
            this.state.newLikesList.length > 0 ||
            this.state.newCommentList.length > 0 > 0) && (
            <>
              <span
                className="dropdown-item "
                style={{ display: "flex", justifyContent: " center" }}
              >
                <span className=" text-muted text-sm">
                  <Follow
                    newFollowers={this.state.newFollowerList}
                    newLikes={this.state.newLikesList}
                    newComments={this.state.newCommentList}
                  />
                </span>
              </span>
            </>
          )) || (
            <span className="dropdown-item dropdown-header">
              No Notifications
            </span>
          )}
        </div>
      </li>
    );
  }
}

export default Notification;
