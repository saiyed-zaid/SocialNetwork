import React from "react";
import { newFollowersList, readPost } from "../api/getNotification";
import NotificationList from "./getNewFollower";
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
        let newLikesList = [];
        let newCommentsList = [];
        if (response.status === 401) {
          localStorage.removeItem("jwt");

          return;
        }

        if (response.data.length > 0) {
          response.data.forEach((post) => {
            //Likes Notification

            post.newLikes.forEach((like, i) => {
              if (like.user._id !== isAuthenticated().user._id) {
                newLikesList.push({
                  id: like.user._id,
                  postId: post.postId,
                  name: like.user.name,
                  likedFrom: like.likedFrom,
                });
              }
            });
            console.log(post.newComments);

            //Comment Notification
            post.newComments.forEach((comment, i) => {
              if (comment.postedBy._id !== isAuthenticated().user._id) {
                newCommentsList.push({
                  id: comment.postedBy._id,
                  postId: post.postId,
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

  render() {
    const { newFollowerList, newLikesList, newCommentList } = this.state;
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
          <span className="badge badge-warning ml-1">
            {newFollowerList.length +
              newLikesList.length +
              newCommentList.length}
          </span>
        </a>

        <div className="dropdown-menu dropdown-menu-lg-right noti-toggle">
          {((newFollowerList.length > 0 ||
            newLikesList.length > 0 ||
            newCommentList.length > 0) && (
            <span
              className="dropdown-item "
              style={{ display: "flex", justifyContent: " center" }}
            >
              <span className=" text-muted text-sm">
                <NotificationList
                  newFollowers={newFollowerList}
                  newLikes={newLikesList}
                  newComments={newCommentList}
                />
              </span>
            </span>
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
