import React from "react";
import {
  read,
  /* isFollowStatusChange */ readPost,
} from "../api/getNotification";

import Follow from "./getNewFollower";
import { isAuthenticated } from "../../auth";

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

  componentDidMount() {
    read()
      .then((data) => {
        var newFollowerList = [];
        if (data.followers.length > 0) {
          //this.setState({ newFollower: new Array(data.followers.length) });

          data.followers.forEach((follower, i) => {
            if (follower.isNewUser) {
              if (follower.user._id !== isAuthenticated().user._id) {
                newFollowerList.push({
                  id: follower.user._id,
                  name: follower.user.name,
                  followedFrom: follower.followedFrom,
                });
              }
            }
          });

          if (newFollowerList.length > 0) {
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

    try {
      readPost().then((data) => {
        let newLikesList = [];
        let newCommentsList = [];
        // console.log("test");

        data.posts.forEach((post) => {
          //Likes Notification
          if (post.likes.length > 0) {
            post.likes.forEach((like, i) => {
              if (like.isNewLike) {
                if (like.user._id !== isAuthenticated().user._id) {
                  newLikesList.push({
                    id: like.user._id,
                    postId: post._id,
                    name: like.user.name,
                    likedFrom: like.likedFrom,
                  });
                }
              }
            });
            if (newLikesList.length > 0) {
              this.setState({
                hasNewLikes: true,
                newLikesList: newLikesList,
              });
            }
          }

          //Comment Notification
          if (post.comments.length > 0) {
            post.comments.forEach((comment, i) => {
              if (comment.isNewComment) {
                if (comment.postedBy._id !== isAuthenticated().user._id) {
                  newCommentsList.push({
                    id: comment.postedBy._id,
                    postId: post._id,
                    name: comment.postedBy.name,
                    commentedFrom: comment.created,
                  });
                }
              }
            });
            if (newCommentsList.length > 0) {
              this.setState({
                hasNewComment: true,
                newCommentList: newCommentsList,
              });
            }
          }
        });
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
      <li className="nav-item dropdown">
        <a
          className="nav-link"
          data-toggle="dropdown"
          href="/"
          aria-expanded="false"
        >
          <i className="far fa-bell text-light" />
          {this.state.newFollowerList.length > 0 ||
          this.state.newLikesList.length > 0 ||
          this.state.newCommentList.length > 0 ? (
            <span className="badge badge-warning navbar-badge">
              {this.state.newFollowerList.length +
                this.state.newLikesList.length +
                this.state.newCommentList.length}
            </span>
          ) : null}
        </a>

        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          {(this.state.newFollowerList.length > 0 && (
            <>
              <a href="/" className="dropdown-item">
                <span className="float-right text-muted text-sm">
                  <Follow
                    newFollowers={this.state.newFollowerList}
                    newLikes={this.state.newLikesList}
                    newComments={this.state.newCommentList}
                  />
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
