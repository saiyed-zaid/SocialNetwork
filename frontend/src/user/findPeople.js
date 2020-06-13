import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuthenticated } from "../auth/index";
import Spinner from "../ui-components/Spinner";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import GoToTop from "../ui-components/goToTop";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false,
      isLoading: true,
      isProcessing: "",
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
  async componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;

    try {
      const response = await this.props.findPeople(userId, token);

      if (response.status === 200) {
        this.setState({ users: response.data, isLoading: false });
      } else {
        return Promise.reject(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  clickFollow = async (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;
    this.setState({ isProcessing: i });
    try {
      const response = await this.props.follow(userId, token, user._id);

      if (response.status === 200) {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          notify: `Started Following ${user.name}`,
          isProcessing: "",
        });
      } else {
        return Promise.reject(response.reject);
      }
    } catch (error) {
      console.log(error);
    }
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
          <div
            className="card"
            key={i}
            style={{
              transition: "unset",
              transform: "unset",
              animation: "unset",
              minWidth: "15rem",
              margin: "1rem",
            }}
          >
            <img
              className="img-thumbnail"
              style={{ maxWidth: "238px" }}
              src={user.photo ? user.photo.photoURI : DefaultProfile}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
            <div className="card-body" style={{ padding: "0" }}>
              <h3 className="profile-username text-center">{user.name}</h3>
              <ul className="list-group list-group-unbordered text-dark">
                <li className="list-group-item">
                  <small>Followers</small>{" "}
                  <small className="float-right text-dark">
                    {user.followers.length}
                  </small>
                </li>
                <li className="list-group-item">
                  <small>Following</small>{" "}
                  <small className="float-right text-dark">
                    {user.following.length}
                  </small>
                </li>
              </ul>

              <div>
                <Link to={`/user/${user._id}`} className="btn btn-info w-100">
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
            style={{
              backgroundColor: "#023340",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
            className="form-control col-md-2  text-light"
            placeholder="Live Search..."
          />
        </div>
        {this.renderUsers(users)}
        <GoToTop />
      </div>
    );
  }
}

export default FindPeople;
