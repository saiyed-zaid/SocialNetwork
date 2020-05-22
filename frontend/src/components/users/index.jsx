import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";

export default class index extends Component {
  render() {
    const { user, authUser, history } = this.props;
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
        <div
          className="card-body"
          style={{ padding: "unset", margin: "unset" }}
        >
          <div className="d-flex">
            <img
              className="img-thumbnail flex-fill"
              src={`${user.photo ? user.photo : DefaultProfile}`}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          </div>
          <h3 className="profile-username text-center">{user.name}</h3>
          <ul className="list-group list-group-unbordered text-dark">
            <li className="list-group-item">
              <small>Followers</small>{" "}
              <small className="float-right text-dark">{user.followers.length}</small>
            </li>
            <li className="list-group-item">
              <small>Following</small>{" "}
              <small className="float-right text-dark">{user.following.length}</small>
            </li>
          </ul>
          <Link to={`/user/${user._id}`} className="btn btn-info">
            View Profile
          </Link>
        </div>
        {/* /.card-body */}
      </div>
    ) : null;
  }
}
