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
    <div className="row m-0">
      {users.map((user, i) => (
        <div className="card col-md-0 custom-card-load" key={i} style={{width:'250px'}}>
          <img
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/${
              user.photo ? user.photo.path : DefaultProfile
            }`}
            onError={i => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h6 className="card-title">{user.name}</h6>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-outline-primary custom-Read-more"
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
      <div className="container-fluid p-0">
        <div className="jumbotron p-3">
          <h4> Users</h4>
        </div>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
