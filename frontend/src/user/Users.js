import React, { Component } from "react";
import { list } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data.users });
      }
    });
  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} users  Users To Be renderd On page
   */
  renderUsers = users => (
    <div className="row">
      {users.map((user, i) => (
        <div
          className="card col-md-3 mr-5 p-0 "
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0.3em 0.3em 0.4em rgba(0,0,0,0.3)"
          }}
          key={i}
        >
          <img
            style={{
              height: "200px",
              width: "auto",
              border: "none"
            }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/${
              user.photo ? user.photo.path : DefaultProfile
            }`}
            onError={i => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mb-5 mt-4">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
