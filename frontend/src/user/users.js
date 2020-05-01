import React, { Component } from "react";
import { list } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
import LoadingGif from "../l1.gif";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      isLoading: true,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      list().then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ users: data.users, isLoading: false });
        }
      });
    }, 2000);
  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} users  Users To Be renderd On page
   */
  renderUsers = (users) => (
    <div className="row m-0">
      {users.map((user, i) =>
        user.role === "subscriber" ? (
          <Card
            className="card col-md-0"
            key={i}
            style={{ width: "18rem" }}
            img={
              <img
                className="card-img-top"
                src={`${process.env.REACT_APP_API_URL}/${
                  user.photo ? user.photo.path : DefaultProfile
                }`}
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
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
        ) : (
          ""
        )
      )}
    </div>
  );
  render() {
    const { users } = this.state;
    return (
      <div className="container-fluid p-0">
        <div className="jumbotron p-3">
          <h4> Users</h4>
        </div>
        {this.state.isLoading && (
          <img src={LoadingGif} />
        )}
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
