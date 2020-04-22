import React, { Component } from "react";
import { list, getOnlineUsers, fetchMessage } from "./apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
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
    };
  }
  componentDidMount() {
    list().then((data) => {
      console.log(data);

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
    document.getElementById("floating-btn").style.display = "none";
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
