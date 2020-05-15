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
import LockScreen from "./auth/pages/lockScreen";
import openSocket from "socket.io-client";
import { authUser, isAuthenticated } from "./auth/index";
import avatar from "./images/avatar.jpg";
import Chattab from "./components/chatTab";
import { fetchMessage } from "./user/apiUser";
import ReactNotifications from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Link } from "react-router-dom";
import ChangePassword from "./auth/pages/changePassword";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#e6cf23" };
  } else return { color: "#ffffff" };
};

const Navbar = withRouter(({ history, authUser, handleLogout, signout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
        <span className="navbar-toggler-icon" />
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
            <ul className="ml-auto mb-0 mr-2 pt-0">
              <li
                className="nav-item "
                style={{
                  listStyleType: "none",
                }}
              >
                <img
                  style={{
                    borderRadius: "50%",
                  }}
                  className="nav-link  p-0 m-0 "
                  src={avatar}
                  height="30px"
                />
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

                  {authUser && authUser.roll !== "admin" && <Notification />}
                </>
              )}
            </ul>
            {authUser ? (
              <ul className="navbar-nav ml-auto mb-0 mr-2 pt-0">
                <li className="nav-item dropdown ">
                  <a
                    className="nav-link"
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
                      className="nav-link  p-0 m-0 img-circle "
                      src={avatar}
                      height="30px"
                    />
                  </a>
                  <div
                    className="dropdown-menu  dropdown-menu-right"
                    aria-labelledby="navbarDropdownMenuLink"
                  >
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
            ) : null}
          </>
        )}
      </div>
    </nav>
  );
});

class MainRouter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasNewMsg: false,
      receiverId: null,
      receiverName: null,
      messages: null,
      authUser: null,
    };

    this.socket = openSocket("http://localhost:5000");
  }

  componentDidMount() {
    if (this.state.authUser) {
      const hourDiff = this.timeDiffCalc(
        new Date(isAuthenticated().user.lastLoggedIn),
        Date.now()
      );
      if (hourDiff > 1) {
        alert("1 hour complted");
        this.setState({ authUser: null }, () => {
          localStorage.removeItem("jwt");
          this.props.history.push("/login");
        });
      }
    }

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

    this.setState({
      authUser: isAuthenticated().user,
    });
  }

  handleChatClose = () => {
    this.setState({ hasNewMsg: false });
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
            />
          </div>
        )}

        <ReactNotifications />
        <Navbar
          authUser={this.state.authUser}
          handleLogout={this.handleLogout}
          signout={this.props.Authservice.signout}
        />

        <Switch>
          <Route path="/" exact component={Home} />
          <Route exact path="/admin/posts" component={AdminPosts} />
          <Route
            exact
            path="/admin/users"
            // component={AdminUsers}
            render={() => (
              <AdminUsers
                remove={this.props.Userservice.remove}
                list={this.props.Userservice.list}
              />
            )}
          />
          <Route exact path="/admin/home" component={AdminHome} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:resetPasswordToken"
            component={ResetPassword}
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
                authUser={this.state.authUser}
              />
            )}
          />
          <PrivateRoute
            path="/post/edit/:postId"
            exact
            component={EditPost}
            authUser={this.state.authUser}
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
          />
          <Route path="/lockscreen" exact component={LockScreen} />
          <PrivateRoute
            path="/user/changepassword/:userId"
            authUser={this.state.authUser}
            exact
            component={ChangePassword}
            read={this.props.Userservice.read}
            changePassword={this.props.Authservice.changePassword}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(MainRouter);
