import React, { Component } from "react";
import { list } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Card from "../components/card";

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
        <Card
          class="card col-md-0 custom-card-load"
          key={i}
          style={{ width: "18rem" }}
          img={
            <img
              className="card-img-top"
              src={`${process.env.REACT_APP_API_URL}/${
                user.photo ? user.photo.path : DefaultProfile
              }`}
              onError={i => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          }
          title={user.title}
          text={user.email}
        >
          <Link to={`/user/${user._id}`} className="btn btn-primary">
            View Profile
          </Link>
        </Card>
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
        {!users.length ? (
          <div className="container-fluid p-0 w-100 h-100 d-flex justify-content-center ">
            <div
              class="spinner-border text-primary"
              style={{ width: "5rem", height: "5rem" }}
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          this.renderUsers(users)
        )}
      </div>
    );
  }
}

export default Users;
