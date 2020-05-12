import React from "react";
import TimeAgo from "react-timeago";

const Follow = (props) => {
  return (
    props.newFollowers && (
      <div>
        {props.newFollowers.map((follower) => (
          <li className="noti w-100" style={{ height: "50px" }}>
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
      </div>
    )
  );
};
export default Follow;
