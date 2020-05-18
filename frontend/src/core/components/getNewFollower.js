import React from "react";
import TimeAgo from "react-timeago";

const Follow = (props) => {
  return (
    props.newFollowers && (
      <div>
        {props.newFollowers.map((follower, i) => (
          <li className="noti w-100" style={{ height: "50px" }} key={i}>
            <strong className="mr-auto">
              {follower.name} Started Following You.
            </strong>
            <small>
              &nbsp;&nbsp;
              {follower.followedFrom ? (
                <TimeAgo date={follower.followedFrom} />
              ) : null}
            </small>
            <div className="dropdown-divider" />
          </li>
        ))}
        {props.newLikes.map((like, i) => (
          <li className="noti w-100" style={{ height: "50px" }} key={i}>
            <strong className="mr-auto"> {like.name} Liked Your Post.</strong>
            <small>
              &nbsp;&nbsp;
              {like.likedFrom ? <TimeAgo date={like.likedFrom} /> : null}
            </small>
            <div className="dropdown-divider" />
          </li>
        ))}
        {props.newComments.map((comment, i) => (
          <li className="noti w-100" style={{ height: "50px" }} key={i}>
            <strong className="mr-auto">
              {comment.name} Commented On Your Post.
            </strong>
            <small>
              &nbsp;&nbsp;
              {comment.commentedFrom ? (
                <TimeAgo date={comment.commentedFrom} />
              ) : null}
            </small>
            <div className="dropdown-divider" />
          </li>
        ))}
      </div>
    )
  );
};
export default Follow;
