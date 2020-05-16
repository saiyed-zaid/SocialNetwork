import React, { Component } from "react";
import { getOnlineUsers, fetchMessage } from "./apiUser";
import GoToTop from "../ui-components/goToTop";
import Spinner from "../ui-components/Spinner";
import { isAuthenticated } from "../auth";
import ChatBar from "../components/chatBar/chatbar";
import Chattab from "../components/chatTab";
import UsersList from "../components/users/index";
import Alert from "../ui-components/Alert";

class Users extends Component {
  constructor(props) {
    super(props);
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

  async componentWillMount() {
    try {
      if (this.props.authUser) {
        const response = await this.props.getUsers(this.props.authUser.token);
        if (response.isAuthorized) {
          if (response.error) {
            console.log(response.error);
          } else {
            this.setState({ users: response.users, isLoading: false });
          }
        }
      } else {
        this.props.history.push("/signin");
      }
    } catch (err) {
      console.log("error", err);
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
        <UsersList
          authUser={this.props.authUser}
          user={user}
          key={i}
          {...this.props}
        />
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
      return <Spinner />;
    }
    return (
      <div className="container-fluid">
        {/* d-flex flex-column align-items-center */}
        {error ? <Alert message={error} type="danger" /> : null}
        <div
          id="chat-tab"
          className="chat-box"
          style={
            this.state.hasChatBoxDisplay
              ? { display: "flex" }
              : { display: "none" }
          }
        ></div>
        <div className="col-md-12">
          <div className="jumbotron p-3">
            {/* <h4> Users</h4> */}
            <div className="row">
              {/* {!users.length && this.renderUsers(users)} */}
              {this.renderUsers(users)}
            </div>
          </div>
        </div>

        {/*  <div
          className="col-md-2 p-0 m-0"
          style={{
            height: "400px",
            position: "fixed !important",
            overflowY: "auto",
          }}
        ></div> */}

        <ChatBar data={onlineUsers} />
        {this.state.hasChatBoxDisplay ? (
          <Chattab
            senderId={this.props.authUser._id}
            senderName={this.props.authUser.name}
            receiverId={this.state.receiverId}
            receiverName={this.state.receiverName}
            handleChatBoxDisplay={this.handleChatBoxDisplay}
            messages={this.state.messages}
          />
        ) : null}
        {/*  <button id="floating-btn" className="floating-btn" onClick={this.onMsg}>
          <i className="fas fa-paper-plane anim-icon"></i>
        </button> */}
        <GoToTop />
      </div>
    );
  }
}
export default Users;
