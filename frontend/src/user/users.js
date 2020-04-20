import React, { Component } from "react";
import { list, getOnlineUsers } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
import { isAuthenticated } from "../auth";
import ChatBar from "../components/chatBar/chatbar";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      onlineUsers: [],
    };
  }
  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data.users });
      }
    });

    getOnlineUsers(
      isAuthenticated().user._id,
      isAuthenticated().user.token
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ onlineUsers: data[0].following });
      }
    });
  }
  onMsg = () => {
    let chatbar = document.getElementById("chatbar");
    chatbar.style.display = "block";
    chatbar.classList.remove("close-chatbar");
    // document.getElementById("floating-btn").style.display = "none";
  };

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} users  Users To Be renderd On page
   */
  renderUsers = (users) => (
    // <div className="row ">
    <>
      {users.map((user, i) =>
        user.role === "subscriber" &&
        user.name !== isAuthenticated().user.name ? (
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
        ) : null
      )}
    </>
  );
  render() {
    const { users, onlineUsers } = this.state;
    return (
      <div className="row container-fluid p-0 m-0">
        <div className="col-md-10">
          <div className="jumbotron p-3">
            <h4> Users</h4>
            <div className="row">
              {!users.length ? <PageLoader /> : this.renderUsers(users)}
            </div>
          </div>
        </div>
        <div
          className="col-md-2 p-0 m-0"
          style={{
            height: "400px",
            position: "fixed !important",
            overflowY: "auto",
          }}
        ></div>
        <ChatBar data={onlineUsers} />
        <button id="floating-btn" className="floating-btn" onClick={this.onMsg}>
          <i className="fas fa-comment"></i>
        </button>
      </div>
    );
  }
}

export default Users;
