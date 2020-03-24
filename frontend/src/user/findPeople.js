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
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;

    findPeople(userId, token).then(data => {
      if (data.err) {
        console.log(data.err);
      } else {
        this.setState({ users: data });
      }
    });
  }

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
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
    <div className="row m-0">
      {users.map((user, i) =>
        user.role === "subscriber" ? (
          <div className="card" key={i}>
            <img
              className="img-thumbnail"
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
              onError={i => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
            <div className="card-body">
              <h6 className="card-title">{user.name}</h6>
              <p>
                <span>Following {user.following.length} </span>
                <span>Followers {user.followers.length}</span>
              </p>

              <div>
                <button
                  onClick={() => this.clickFollow(user, i)}
                  className="btn btn-primary mr-1"
                  style={{
                    flex: "1",
                    border: "none !important",
                    margin: "1px"
                  }}
                >
                  Follow
                </button>
                <Link
                  to={`/user/${user._id}`}
                  className="btn btn-outline-primary"
                  style={{
                    flex: "1",
                    border: "none !important",
                    margin: "1px"
                  }}
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container-fluid p-0">
        <div className="jumbotron p-3">
          <h4>Find Friends</h4>
        </div>
        {open && (
          <div className="alert alert-info alert-dismissible fade show col-md-4">
            {followMessage}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>{" "}
          </div>
        )}
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
        }
      </div>
    );
  }
}

export default FindPeople;
