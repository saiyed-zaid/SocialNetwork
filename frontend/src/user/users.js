import React, { Component } from "react";
import { list, getOnlineUsers, fetchMessage } from "./apiUser";
import { Link } from "react-router-dom";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
import LoadingGif from "../l1.gif";
import { isAuthenticated } from "../auth";
import ChatBar from "../components/chatBar/chatbar";
import Chattab from "../components/chatTab";
import UsersList from "../components/users/index";
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
      error: "",
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
    if (this.props.authUser) {
      getOnlineUsers(this.props.authUser._id, this.props.authUser.token)
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            this.setState({ onlineUsers: data[0].following });
          }
        })
        .catch((error) => this.setState({ error: error }));
    }
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
      {users.map((user, i) => (
        <UsersList authUser={this.props.authUser} user={user} key={i} {...this.props} />
      ))}
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
    const { users, onlineUsers, error } = this.state;
    if (this.state.isLoading) {
      return <img src={LoadingGif} />;
    }
    return (
      <div className="row container-fluid p-0 m-0">
        {error ? (
          <div class="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
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
            {/* <h4> Users</h4> */}
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
