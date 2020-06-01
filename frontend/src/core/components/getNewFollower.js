import React from "react";
import TimeAgo from "react-timeago";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHeart,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import {
  isFollowStatusChange,
  isLikesStatusChange,
  isCommentStatusChange,
} from "../api/getNotification";
const Follow = (props) => {
  return (
    <div>
      {props.newFollowers &&
        props.newFollowers.map((follower, i) => (
          <span className="noti " key={i}>
            <small className="mr-auto">
              <Link to={`/user/${follower.id}`}>
                <FontAwesomeIcon icon={faUser} className="text-primary" />
                &nbsp; &nbsp; &nbsp;
                <span className="font-weight-bold"> {follower.name}</span>
                &nbsp; Started Following You.
              </Link>
            </small>
            <small>
              &nbsp;&nbsp;
              {follower.followedFrom ? (
                <TimeAgo date={follower.followedFrom} />
              ) : null}
            </small>
            ;&nbsp;
            <button
              className="float-right"
              style={{ border: "0px none", backgroundColor: "white" }}
              onClick={() => isFollowStatusChange(follower.id)}
            >
              &times;
            </button>
            <div className="dropdown-divider" />
          </span>
        ))}

      {props.newLikes &&
        props.newLikes.map((like, i) => (
          <span
            className="noti"
            key={i}
            style={{ maxWidth: "50px !important" }}
          >
            <small className="mr-auto">
              <Link to={`/post/${like.postId}`}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-danger icon-heart"
                />
                &nbsp; &nbsp; &nbsp;
                <span className="font-weight-bold">{like.name}</span>{" "}
                &nbsp;Liked Your Post.
              </Link>
            </small>
            <small>
              &nbsp;&nbsp;
              {like.likedFrom && <TimeAgo date={like.likedFrom} />}
            </small>
            &nbsp;
            <button
              className="float-right"
              style={{ border: "0px none", backgroundColor: "white" }}
              onClick={() => isLikesStatusChange(like.postId, like.id)}
            >
              &times;
            </button>
            <div className="dropdown-divider" />
          </span>
        ))}
      {props.newComments &&
        props.newComments.map((comment, i) => (
          <span className="noti w-100" key={i}>
            <small className="mr-auto w-50">
              <Link to={`/post/${comment.postId}`}>
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="text-secondary"
                />
                &nbsp; &nbsp; &nbsp;
                <span className="font-weight-bold">{comment.name}</span>&nbsp;
                &nbsp; Commented On Your Post.
              </Link>
            </small>
            <small>
              &nbsp;&nbsp;
              {comment.commentedFrom && (
                <TimeAgo date={comment.commentedFrom} />
              )}
            </small>
            &nbsp;
            <button
              // className="float-right"
              style={{ border: "0px none", backgroundColor: "white" }}
              onClick={() => isCommentStatusChange(comment.postId, comment.id)}
            >
              &times;
            </button>
            <div className="dropdown-divider" />
          </span>
        ))}
    </div>
  );
};
export default withRouter(Follow);
