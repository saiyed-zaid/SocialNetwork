import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./core/home";
// /import Menu from "./core/menu";
import Notification from "./core/components/Notification";
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
import avatar from "./images/avatar.jpg";
import Chattab from "./components/chatTab";
import { fetchMessage } from "./user/apiUser";
import ReactNotifications from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Link } from "react-router-dom";
import ChangePassword from "./auth/pages/changePassword";
import ScheduledPost from "./post/scheduledPosts";
import MsgNotification from "./core/components/messageNotification";
import EditScheduledPost from "./post/editScheduledPost";
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#e6cf23" };
  } else return { color: "#ffffff" };
};

const Navbar = withRouter(
  ({ history, authUser, handleLogout, signout, handleChatOpen }) => {
    return (
      <nav className="navbar sticky-top  navbar-expand-lg navbar-dark bg-dark">
        {authUser && authUser.role === "admin" ? (
          <Link className="navbar-brand " to="/admin/home">
            Retwit
          </Link>
        ) : (
          <Link className="navbar-brand" to="/">
            Retwit
          </Link>
        )}

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon toggler" />
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          {authUser && authUser.role === "admin" ? (
            <>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link
                    className="nav-link"
                    to="/admin/users"
                    style={isActive(history, `/admin/users`)}
                  >
                    USERS <span className="sr-only">(current)</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/admin/posts"
                    style={isActive(history, `/admin/posts`)}
                  >
                    POSTS
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/user/${authUser._id}`}
                    style={isActive(history, `/user/${authUser._id}`)}
                  >
                    {`${authUser.name.toUpperCase()} 'S PROFILE`}
                  </Link>
                </li>
                <li>
                  {!authUser && (
                    <>
                      <Link
                        className="nav-link"
                        to="/signin"
                        style={isActive(history, "/signin")}
                      >
                        SIGN IN
                      </Link>
                      <Link
                        className="nav-link"
                        to="/signup"
                        style={isActive(history, "/signup")}
                      >
                        SIGN UP
                      </Link>
                    </>
                  )}
                </li>
              </ul>

              <ul className="navbar-nav ml-auto ">
                {authUser && authUser.roll !== "admin" && (
                  <Notification authUser={authUser} />
                )}
                <li className="nav-item dropdown profile-btn ">
                  <a
                    className="nav-link d-flex align-items-center"
                    href="/"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      style={{
                        borderRadius: "50%",
                        height: "30px !important",
                        width: "30px !important",
                      }}
                      className="nav-link  p-0 m-0 ml-1 img-circle float-right "
                      src={authUser.photo ? authUser.photo.photoURI : avatar}
                      width="30px "
                      height="30px"
                      onError={(e) => (e.target.src = avatar)}
                      alt="user "
                    />
                    <span>&nbsp;{authUser.name.toUpperCase()}</span>
                  </a>
                  <div
                    className="dropdown-menu  dropdown-menu-right"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <Link
                      className="dropdown-item"
                      to={`/user/edit/${authUser._id}`}
                    >
                      Manage Profile
                    </Link>
                    <Link
                      className="dropdown-item"
                      to={`/user/changepassword/${authUser._id}`}
                    >
                      Change Password
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="/signin"
                      onClick={() =>
                        signout(() => {
                          handleLogout();
                        })
                      }
                    >
                      Logout
                    </Link>
                  </div>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/"
                    style={isActive(history, "/")}
                  >
                    HOME
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/users"
                    style={isActive(history, "/users")}
                  >
                    USERS
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/post/create`}
                    style={isActive(history, `/post/create`)}
                  >
                    CREATE POST
                  </Link>
                </li>

                {!authUser && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link  active"
                        to="/signin"
                        style={isActive(history, "/signin")}
                      >
                        SIGN IN
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/signup"
                        style={isActive(history, "/signup")}
                      >
                        SIGN UP
                      </Link>
                    </li>
                  </>
                )}

                {authUser && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`/findpeople/${authUser._id}`}
                        style={isActive(history, `/findpeople/${authUser._id}`)}
                      >
                        FIND FRIENDS
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={`/user/${authUser._id}`}
                        style={isActive(history, `/user/${authUser._id}`)}
                      >
                        {`${authUser.name.toUpperCase()}'S PROFILE`}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              {authUser ? (
                <ul className="navbar-nav ml-auto nav-mobile ">
                  {authUser && authUser.roll !== "admin" && (
                    <>
                      <MsgNotification handleOpen={handleChatOpen} />
                      <Notification authUser={authUser} />
                    </>
                  )}
                  <li className="nav-item dropdown profile-btn ">
                    <a
                      className="nav-link "
                      href="/"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <img
                        style={{
                          borderRadius: "50%",
                        }}
                        className="nav-link  p-0 m-0 ml-1 img-circle float-right "
                        src={authUser.photo ? authUser.photo.photoURI : avatar}
                        width="30px"
                        height="30px"
                        onError={(e) => (e.target.src = avatar)}
                        alt="user "
                      />
                      <span>&nbsp;{authUser.name.toUpperCase()}</span>
                    </a>
                    <div
                      className="dropdown-menu  dropdown-menu-right"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <Link
                        className="dropdown-item"
                        to={`/user/edit/${authUser._id}`}
                      >
                        Manage Profile
                      </Link>
                      <Link
                        className="dropdown-item"
                        to={`/user/changepassword/${authUser._id}`}
                      >
                        Change Password
                      </Link>
                      <Link
                        className="dropdown-item"
                        to={`/post/scheduledposts/${authUser._id}`}
                      >
                        Scheduled Posts
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="/signin"
                        onClick={() =>
                          signout(() => {
                            handleLogout();
                          })
                        }
                      >
                        Logout
                      </Link>
                    </div>
                  </li>
                </ul>
              ) : null}
            </>
          )}
        </div>
      </nav>
    );
  }
);

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
    };

    this.socket = openSocket("http://localhost:5000");
  }

  componentDidMount() {
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
      receiverName: user.users.name,
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
            path="/admin/users"
            render={() => (
              <AdminUsers
                remove={this.props.Userservice.remove}
                list={this.props.Userservice.list}
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
                getUsers={this.props.Userservice.list}
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
            updateUser={this.props.Userservice.updateUser}
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
            updateUser={this.props.Userservice.updateUser}
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
        </Switch>
      </div>
    );
  }
}

export default withRouter(MainRouter);
