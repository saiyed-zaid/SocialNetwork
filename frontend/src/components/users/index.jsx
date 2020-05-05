import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";

export default class index extends Component {
  render() {
    const { user, authUser } = this.props;
    console.log(this.props);

    return user.role === "subscriber" && user.name !== authUser.name ? (
      <div
        className="card w-50"
        style={{
          transition: "unset",
          transform: "unset",
          animation: "unset",
        }}
      >
        <div className="card-body box-profile">
          <div className="text-center">
            <img
              className="profile-user-img img-fluid img-circle"
              src={`${process.env.REACT_APP_API_URL}/${
                user.photo ? user.photo.path : DefaultProfile
              }`}
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
          <Link to={`/user/${user._id}`} className="btn btn-primary ">
            View Profile
          </Link>
        </div>
        {/* /.card-body */}
      </div>
    ) : null;
  }
}
