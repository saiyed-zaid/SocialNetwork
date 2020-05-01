import React, { Component } from "react";
import { list, getOnlineUsers, fetchMessage } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
import LoadingGif from "../l1.gif";
import { isAuthenticated } from "../auth";
import ChatBar from "../components/chatBar/chatbar";
import Chattab from "../components/chatTab";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      onlineUsers: [],
      hasChatBoxDisplay: false,
      receiverId: undefined,
      receiverName: undefined,
      messages: null,
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

    /**
     * Function For Getting Online Users
     */
    getOnlineUsers(isAuthenticated().user._id, isAuthenticated().user.token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ onlineUsers: data[0].following });
        }
      })
      .catch();
  }
  onMsg = () => {
    let chatbar = document.getElementById("chatbar");
    chatbar.style.display = "block";
    chatbar.classList.remove("close-chatbar");
    document.getElementById("floating-btn").style.display = "none";
  };

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} users  Users To Be renderd On page
   */
  renderUsers = (users) => (
    <>
      {users.map((user, i) =>
        user.role === "subscriber" &&
        user.name !== isAuthenticated().user.name ? (
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
              {/* <p className="text-muted text-center">Software Engineer</p> */}
              <ul className="list-group list-group-unbordered mb-3 ">
                <li className="list-group-item bg-dark">
                  <b>Followers</b>{" "}
                  <a className="float-right">{user.followers.length}</a>
                </li>
                <li className="list-group-item bg-dark">
                  <b>Following</b>{" "}
                  <a className="float-right">{user.following.length}</a>
                </li>
                {/* <li className="list-group-item">
                  <b>Friends</b> <a className="float-right">13,287</a>
                </li> */}
              </ul>
              <Link to={`/user/${user._id}`} className="btn btn-primary">
                View Profile
              </Link>
            </div>
            {/* /.card-body */}
          </div>
        ) : /*  <Card
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
         */ null
      )}
    </>
  );

  handleChatBoxDisplay = (e) => {
    e.persist();
    if (!this.state.hasChatBoxDisplay) {
      const token = isAuthenticated().user.token;
      fetchMessage(
        isAuthenticated().user._id,
        e.target.getAttribute("data-userId"),
        token
      )
        .then((result) => {
          this.setState({
            hasChatBoxDisplay: true,
            receiverId: e.target.getAttribute("data-userId"),
            receiverName: e.target.getAttribute("data-name"),
            messages: result,
          });
        })
        .catch((err) => {
          if (err) {
            console.log("Error while fetching record");
          }
        });
    } else {
      this.setState({
        hasChatBoxDisplay: false,
      });
    }
  };

  render() {
    const { users, onlineUsers } = this.state;
    if (this.state.isLoading) {
      return <img src={LoadingGif} />;
    }
    return (
      <div className="row container-fluid p-0 m-0">
        <div
          id="chat-tab"
          className="justify-content-end align-items-end chat-box"
          style={
            this.state.hasChatBoxDisplay
              ? { display: "flex" }
              : { display: "none" }
          }
        ></div>
        <div className="col-md-10">
          <div className="jumbotron p-3">
            <h4> Users</h4>
            <div className="row">
           
              {!users.length && this.renderUsers(users)}
            </div>
          </div>
        </div>
        {this.renderUsers(users)}
        <div
          className="col-md-2 p-0 m-0"
          style={{
            height: "400px",
            position: "fixed !important",
            overflowY: "auto",
          }}
        ></div>
        <ChatBar data={onlineUsers} />
        {this.state.hasChatBoxDisplay ? (
          <Chattab
            senderId={isAuthenticated().user._id}
            senderName={isAuthenticated().user.name}
            receiverId={this.state.receiverId}
            receiverName={this.state.receiverName}
            handleChatBoxDisplay={this.handleChatBoxDisplay}
            messages={this.state.messages}
          />
        ) : (
          ""
        )}
        <button id="floating-btn" className="floating-btn" onClick={this.onMsg}>
          <i className="fas fa-paper-plane anim-icon"></i>
        </button>
      </div>
    );
  }
}
export default Users;
