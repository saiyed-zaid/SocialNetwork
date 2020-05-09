import React from "react";

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
              {follower.followedFrom
                ? `${new Date(follower.followedFrom).toDateString()}`
                : ""}
            </small>
            <div className="dropdown-divider" />
          </li>
        ))}
      </div>
    )
  );
};
export default Follow;
