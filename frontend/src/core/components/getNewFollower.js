import React from "react";
import TimeAgo from "react-timeago";
import { Link, withRouter } from "react-router-dom";

const Follow = (props) => {
  return (
    <div>
      {props.newFollowers &&
        props.newFollowers.map((follower, i) => (
          <span className="noti w-100" key={i}>
            <small className="mr-auto">
              <Link to={`/user/${follower.id}`}>
                {follower.name} Started Following You.
              </Link>
            </small>
            <small>
              &nbsp;&nbsp;
              {follower.followedFrom ? (
                <TimeAgo date={follower.followedFrom} />
              ) : null}
            </small>
            <div className="dropdown-divider" />
          </span>
        ))}

      {props.newLikes &&
        props.newLikes.map((like, i) => (
          <span className="noti w-100" key={i}>
            <small className="mr-auto">
              <Link to={`/post/${like.postId}`}>
                {like.name} Liked Your Post.{" "}
              </Link>
            </small>
            <small>
              &nbsp;&nbsp;
              {like.likedFrom ? <TimeAgo date={like.likedFrom} /> : null}
            </small>
            <div className="dropdown-divider" />
          </span>
        ))}
      {props.newComments &&
        props.newComments.map((comment, i) => (
          <span className="noti w-100" key={i}>
            <small className="mr-auto">
              <Link to={`/post/${comment.postId}`}>
                {comment.name} Commented On Your Post.{" "}
              </Link>
            </small>
            <small>
              &nbsp;&nbsp;
              {comment.commentedFrom ? (
                <TimeAgo date={comment.commentedFrom} />
              ) : null}
            </small>
            <div className="dropdown-divider" />
          </span>
        ))}
    </div>
  );
};
export default withRouter(Follow);
