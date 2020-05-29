import React, { Component } from "react";
import GoToTop from "../ui-components/goToTop";
import Spinner from "../ui-components/Spinner";
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
    /*   if (this.props.authUser) {
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
   */
  }

  async componentWillMount() {
    try {
      if (this.props.authUser) {
        const response = await this.props.getUsers(this.props.authUser.token);

        if (response.status === 200) {
          this.setState({ users: response.data.users, isLoading: false });
        } else {
          return Promise.reject(response.error);
        }
      } else {
        this.props.history.push("/signin");
      }
    } catch (err) {
      console.log("error", err);
    }
  }

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

  render() {
    const { users, onlineUsers, error } = this.state;
    console.log(users, onlineUsers);

    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <div className="container-fluid">
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
            <div className="row">{this.renderUsers(users)}</div>
          </div>
        </div>

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

        <GoToTop />
      </div>
    );
  }
}
export default Users;
