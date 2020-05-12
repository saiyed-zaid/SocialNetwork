import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuthenticated } from "../auth/index";
import Spinner from "../ui-components/Spinner";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false,
      isLoading: true,
      isProcessing: false,
      search: "",
      networkError: false,
    };
  }

  /*  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }; */
  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;
    setTimeout(async () => {
      const response = await this.props.findPeople(userId, token);
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({ users: response, isLoading: false });
      }
    }, 1000);
  }

  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;
    this.setState({ isProcessing: true });

    follow(userId, token, user._id).then((data) => {
      if (data.err) {
        this.setState({ error: data.err });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          notify: `Started Following ${user.name}`,
          isProcessing: false,
        });
      }
    });
  };

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} users  Users To Be renderd On page
   */
  renderUsers = (users) => (
    <div className="row m-0">
      {users.map((user, i) =>
        user.role === "subscriber" ? (
          <div className="card" key={i}>
            <img
              className="img-thumbnail"
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
            <div className="card-body  text-info">
              <h6 className="card-title">{user.name}</h6>
              <p>
                <span>Following ({user.following.length}) </span>
                <span>Followers ({user.followers.length}) </span>
              </p>

              <div>
                <button
                  onClick={() => this.clickFollow(user, i)}
                  className="btn btn-outline-info mr-1"
                  style={{
                    flex: "1",
                    border: "none !important",
                    margin: "1px",
                  }}
                  disabled={this.state.isProcessing}
                >
                  {this.state.isProcessing && <Spinner />}
                  &nbsp; Follow
                </button>
                <Link
                  to={`/user/${user._id}`}
                  className="btn btn-outline-info"
                  style={{
                    flex: "1",
                    border: "none !important",
                    margin: "1px",
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

  updateSearch = (event) => {
    this.setState({ search: event.target.value.substr(0, 20) });
  };

  render() {
    // const { open, followMessage } = this.state;
    const users = this.state.users.filter((user) => {
      return user.name.indexOf(this.state.search) !== -1;
    });

    if (users.length < 0 || this.state.isLoading) {
      return this.state.isLoading && <Spinner />;
    }

    this.state.notify &&
      store.addNotification({
        title: "Success",
        message: this.state.notify,
        type: "success", // 'default', 'success', 'info', 'warning'
        container: "top-right", // where to position the notifications
        animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
        dismiss: {
          duration: 3000,
        },
      });

    return (
      <div className="container-fluid p-0">
        <div className="jumbotron p-3">
          {/* <h4>Find Friends</h4> */}
          <input
            type="text"
            value={this.state.search}
            onChange={this.updateSearch}
            style={{ border: "1px solid black" }}
            className="form-control col-md-2 "
            placeholder="Live Search..."
          />
        </div>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
