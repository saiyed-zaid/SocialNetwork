import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./core/home";
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
import { messageStatusChange } from "./core/api/getNotification";
import openSocket from "socket.io-client";
import { isAuthenticated } from "./auth/index";
import Chattab from "./components/chatTab";
import { fetchMessage } from "./user/apiUser";
import ReactNotifications from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import ChangePassword from "./auth/pages/changePassword";
import ScheduledPost from "./post/scheduledPosts";
import EditScheduledPost from "./post/editScheduledPost";
import Navbar from "./components/navbar";
import ChatBar from "./components/chatBar/chatbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import AdminScheduledPosts from "./admin/shceduledPosts";
import Insights from "./reports/index";

class MainRouter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasNewMsg: false,
      receiverId: null,
      receiverName: null,
      messages: null,
      authUser: isAuthenticated().user || null,
      isAuthorized: null,
      onlineUsers: [],
    };

    this.socket = openSocket("http://localhost:5000");
  }

  async componentDidMount() {
    if (this.state.authUser) {
      this.socket.on(this.state.authUser._id, (data) => {
        fetchMessage(
          this.state.authUser._id,
          data.sender,
          this.state.authUser.token
        )
          .then((result) => {
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

      try {
        const response = await this.props.Userservice.getOnlineUsers(
          this.state.authUser._id,
          this.state.authUser.token
        );

        if (response.data.error) {
          console.log(response.data.error);
        } else {
          this.setState({ onlineUsers: response.data[0].following });
        }
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  componentWillMount() {
    if (this.state.authUser) {
      const hourDiff = this.timeDiffCalc(
        new Date(isAuthenticated().user.lastLoggedIn),
        Date.now()
      );
      if (hourDiff >= 1) {
        this.setState({ authUser: null, isAuthorized: false }, () => {
          localStorage.removeItem("jwt");
          this.props.history.push("/signin");
        });
      }
    }
  }

  handleChatClose = () => {
    this.setState({ hasNewMsg: false });
  };
  handleChatOpen = (user) => {
    this.setState({
      hasNewMsg: true,
      receiverId: user._id,
      receiverName: user.users ? user.users.name : user.name,
    });
    messageStatusChange()
      .then((data) => console.log(data))
      .catch();
  };

  handleLogout = () => {
    this.setState({
      authUser: null,
    });
  };

  handleAuthUserUpdate = () => {
    this.setState({
      authUser: isAuthenticated().user,
    });
  };
  onMsg = () => {
    let chatbar = document.getElementById("chatbar");
    chatbar.style.display = "block";
    chatbar.classList.remove("close-chatbar");
    document.getElementById("floating-btn").style.display = "none";
  };
  timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    //console.log('calculated days', days);

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    //console.log('calculated hours', hours);

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    //console.log('minutes', minutes);

    let difference = "";
    /* if (days > 0) {
      difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    } */

    difference += hours === 0 || hours === 1 ? `${hours}` : `${hours}`;
    /* difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `; */

    //difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;
    return hours;
    //return difference;
  }

  render() {
    return (
      <div>
        {this.state.hasNewMsg && (
          <div
            id="chat-tab"
            className=" d-flex justify-content-end align-items-end chat-box"
          >
            <Chattab
              senderId={this.state.authUser._id}
              senderName={this.state.authUser.name}
              receiverId={this.state.receiverId}
              receiverName={this.state.receiverName}
              messages={this.state.messages}
              handleChatBoxDisplay={this.handleChatClose}
              authUser={this.state.authUser}
              fetchMessage={this.props.Userservice.fetchMessage}
            />
          </div>
        )}

        <ReactNotifications />
        <Navbar
          authUser={this.state.authUser}
          handleLogout={this.handleLogout}
          signout={this.props.Authservice.signout}
          handleChatOpen={this.handleChatOpen}
        />
        <ChatBar
          data={this.state.onlineUsers}
          handleOpen={this.handleChatOpen}
        />

        {this.state.authUser && this.state.authUser.role === "subscriber" && (
          <button
            id="floating-btn"
            className="floating-btn"
            onClick={this.onMsg}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="anim-icon" />
          </button>
        )}

        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            exact
            path="/admin/posts"
            render={() => (
              <AdminPosts
                updatePost={this.props.Postservice.editPost}
                list={this.props.Postservice.fetchPosts}
                remove={this.props.Postservice.deletePost}
              />
            )}
          />
          <Route
            exact
            path="/admin/scheduledposts"
            render={() => (
              <AdminScheduledPosts
                editScheduledPost={this.props.Postservice.editScheduledPost}
                fetchAllScheduledPosts={
                  this.props.Postservice.fetchAllScheduledPosts
                }
                deleteScheduledPost={this.props.Postservice.deleteScheduledPost}
              />
            )}
          />
          <Route
            exact
            path="/admin/users"
            render={() => (
              <AdminUsers
                remove={this.props.Userservice.remove}
                getAll={this.props.Userservice.getAll}
                update={this.props.Userservice.update}
              />
            )}
          />
          <PrivateRoute exact path="/admin/home" component={AdminHome} />
          <PrivateRoute exact path="/admin" component={Admin} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:resetPasswordToken"
            // component={ResetPassword}
            render={() => (
              <ResetPassword
                resetPassword={this.props.Authservice.resetPassword}
              />
            )}
          />
          <PrivateRoute
            path="/post/create"
            exact
            component={NewPost}
            authUser={this.state.authUser}
            addPost={this.props.Postservice.addPost}
            read={this.props.Userservice.read}
          />
          <Route
            path="/post/:postId"
            exact
            render={(props) => (
              <SinglePost
                {...props}
                fetchPost={this.props.Postservice.fetchPost}
                deletePost={this.props.Postservice.deletePost}
                editPost={this.props.Postservice.editPost}
                likePost={this.props.Postservice.likePost}
                unlikePost={this.props.Postservice.unlikePost}
                addComment={this.props.Postservice.addComment}
                removeComment={this.props.Postservice.removeComment}
                replyComment={this.props.Postservice.commentReply}
                authUser={this.state.authUser}
                read={this.props.Userservice.read}
              />
            )}
          />
          <PrivateRoute
            path="/post/edit/:postId"
            exact
            component={EditPost}
            authUser={this.state.authUser}
            editPost={this.props.Postservice.editPost}
            fetchPost={this.props.Postservice.fetchPost}
            read={this.props.Userservice.read}
          />
          <Route
            path="/users"
            exact
            render={(props) => (
              <Users
                {...props}
                authUser={this.state.authUser}
                getAll={this.props.Userservice.getAll}
              />
            )}
          />
          <Route
            path="/signup"
            exact
            render={(props) => (
              <Signup
                {...this.props}
                registerUser={this.props.Authservice.registerUser}
              />
            )}
          />
          <Route
            path="/signin"
            exact
            render={(props) => (
              <Signin
                handleAuthUserUpdate={this.handleAuthUserUpdate}
                {...this.props}
                loginUser={this.props.Authservice.loginUser}
                socialLogin={this.props.Authservice.socialLogin}
                authenticate={this.props.Authservice.authenticate}
              />
            )}
          />
          <PrivateRoute
            path="/user/edit/:userId"
            exact
            component={EditProfile}
            update={this.props.Userservice.update}
            read={this.props.Userservice.read}
            updateLocalStorage={this.props.Userservice.updateLocalStorage}
          />
          <PrivateRoute
            path="/findpeople/:userId"
            exact
            component={FindPeople}
            findPeople={this.props.Userservice.findPeople}
            follow={this.props.Userservice.follow}
          />
          <PrivateRoute
            path="/user/:userId"
            authUser={this.state.authUser}
            exact
            component={Profile}
            fetchPostsByUser={this.props.Postservice.fetchPostsByUser}
            update={this.props.Userservice.update}
            read={this.props.Userservice.read}
            remove={this.props.Userservice.remove}
            fetchMessage={this.props.Userservice.fetchMessage}
            updateLocalStorage={this.props.Userservice.updateLocalStorage}
            listByUser={this.props.Postservice.listByUser}
            updatePost={this.props.Postservice.editPost}
            unfollow={this.props.Userservice.unfollow}
            follow={this.props.Userservice.follow}
          />
          {/* <Route path="/lockscreen" exact render={() => <LockScreen />} /> */}
          <PrivateRoute
            path="/user/changepassword/:userId"
            authUser={this.state.authUser}
            exact
            component={ChangePassword}
            read={this.props.Userservice.read}
            changePassword={this.props.Authservice.changePassword}
          />
          <PrivateRoute
            path="/post/scheduledposts/:userId"
            exact
            component={ScheduledPost}
            fetchScheduledPosts={this.props.Postservice.fetchScheduledPosts}
            authUser={this.state.authUser}
            deleteScheduledPost={this.props.Postservice.deleteScheduledPost}
          />
          <PrivateRoute
            path="/post/scheduledpost/edit/:postId"
            exact
            component={EditScheduledPost}
            authUser={this.state.authUser}
            editScheduledPost={this.props.Postservice.editScheduledPost}
            fetchScheduledPost={this.props.Postservice.fetchScheduledPost}
            read={this.props.Userservice.read}
          />
          <PrivateRoute
            path="/user/insights/:userId"
            exact
            component={Insights}
            getYearlyReport={this.props.Reportservice.getYearlyReport}
            getMonthlyReport={this.props.Reportservice.getMonthlyReport}
            getDailyReport={this.props.Reportservice.getDailyReport}
            authUser={this.state.authUser}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(MainRouter);
