import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuthenticated } from "../auth/index";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false
    };
  }
  componentDidMount() {
    const userId = isAuthenticated().user._Id;
    const token = isAuthenticated().user.token;

    findPeople(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data.users });
      }
    });
  }

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._Id;
    const token = isAuthenticated().user.token;

    follow(userId, token, user._id).then(data => {
      if (data.err) {
        this.setState({ error: data.err });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} users  Users To Be renderd On page
   */
  renderUsers = users => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4 " key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
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
            <button
              onClick={() => this.clickFollow(user, i)}
              className="btn btn-raised btn-info float-right-btn-sm"
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  render() {
    const { users, open, followMessage, error } = this.state;
    return (
      <div className="container">
        <h2 className="mb-5 mt-4">Find Friends</h2>
        {open && (
          <div className="alert alert-info alert-dismissible fade show">
            {followMessage}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
