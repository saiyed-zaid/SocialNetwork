import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/home";
import Menu from "./core/menu";
import Signup from "./auth/pages/signup";
import Signin from "./auth/pages/signin";
import Profile from "./user/profile";
import FindPeople from "./user/findPeople";
import Users from "./user/users";
import EditProfile from "./user/editProfile";
import NewPost from "./post/newPost";
import SinglePost from "./post/singlePost";
import EditPost from "./post/editPost";
import ForgotPassword from "./auth/pages/forgotPassword";
import ResetPassword from "./auth/pages/resetPassword";
import Admin from "./admin/admin";
import AdminUsers from "./admin/users";
import AdminPosts from "./admin/posts";
import AdminHome from "./admin/admin";
import PrivateRoute from "./auth/privateRoute";
import LockScreen from "./auth/pages/lockScreen";
import openSocket from "socket.io-client";
import { isAuthenticated } from "./auth/index";
import Chattab from "./components/chatTab";
import { fetchMessage } from "./user/apiUser";

export default class MainRouter extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hasNewMsg: false,
      receiverId: null,
      receiverName: null,
      messages: null,
    };

    this.socket = openSocket("http://localhost:5000");
  }
  componentDidMount() {
    if (isAuthenticated().user) {
      this.socket.on(isAuthenticated().user._id, (data) => {
        fetchMessage(
          isAuthenticated().user._id,
          data.sender,
          isAuthenticated().user.token
        )
          .then((result) => {
            console.log(result);
            this.setState({
              hasNewMsg: true,
              receiverId: data.sender,
              receiverName: data.senderName,
              messages: result,
            });
          })
          .catch((err) => {
            if (err) {
              console.log("Error while fetching record");
            }
          });
      });
    } else {
    }
  }

  handleChatClose = () => {
    this.setState({ hasNewMsg: false });
  };
  render() {
    return (
      <div>
        {this.state.hasNewMsg && (
          <div
            id="chat-tab"
            className=" d-flex justify-content-end align-items-end chat-box"
          >
            <Chattab
              senderId={isAuthenticated().user._id}
              senderName={isAuthenticated().user.name}
              receiverId={this.state.receiverId}
              receiverName={this.state.receiverName}
              messages={this.state.messages}
              handleChatBoxDisplay={this.handleChatClose}
            />
          </div>
        )}
        <Menu />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route exact path="/admin/posts" component={AdminPosts} />
          <Route exact path="/admin/users" component={AdminUsers} />
          <Route exact path="/admin/home" component={AdminHome} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:resetPasswordToken"
            component={ResetPassword}
          />
          <PrivateRoute path="/post/create" exact component={NewPost} />
          <Route path="/post/:postId" exact component={SinglePost} />
          <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
          <Route path="/users" exact component={Users} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/signin" exact component={Signin} />
          <PrivateRoute
            path="/user/edit/:userId"
            exact
            component={EditProfile}
          />
          <PrivateRoute
            path="/findpeople/:userId"
            exact
            component={FindPeople}
          />
          <PrivateRoute path="/user/:userId" exact component={Profile} />
          <Route path="/lockscreen" exact component={LockScreen} />
        </Switch>
      </div>
    );
  }
}
