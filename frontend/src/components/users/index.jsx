import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";

export default class index extends Component {
  render() {
    const { user, authUser } = this.props;
    return user.role === "subscriber" && user.name !== authUser.name ? (
      <div
        className="card"
        style={{
          transition: "unset",
          transform: "unset",
          animation: "unset",
          width: "15rem",
          margin: "1rem",
        }}
      >
        <div className="card-body box-profile">
          <div className="text-center">
            <img
              className="profile-user-img img-fluid img-circle"
              src={user.photo ? user.photo : DefaultProfile}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          </div>
          <h3 className="profile-username text-center">{user.name}</h3>
          <ul className="list-group list-group-unbordered mb-1">
            <li className="list-group-item bg-dark">
              <b>Followers</b>{" "}
              <p className="float-right">{user.followers.length}</p>
            </li>
            <li className="list-group-item bg-dark">
              <b>Following</b>{" "}
              <p className="float-right">{user.following.length}</p>
            </li>
            {/* <li className="list-group-item">
                        <b>Friends</b> <a className="float-right">13,287</a>
                      </li> */}
          </ul>
          <Link to={`/user/${user._id}`} className="btn btn-dark">
            View Profile
          </Link>
        </div>
        {/* /.card-body */}
      </div>
    ) : null;
  }
}
