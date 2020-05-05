import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./core/home";
//import Menu from "./core/menu";
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
import openSocket from "socket.io-client";
import { authUser, signout, isAuthenticated } from "./auth/index";
import Chattab from "./components/chatTab";
import { fetchMessage } from "./user/apiUser";
import ReactNotifications from "react-notifications-component";
import { Link } from "react-router-dom";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#e6cf23" };
  } else return { color: "#ffffff" };
};

const Navbar = withRouter(({ history, authUser, handleLogout }) => {
  authUser && console.log(authUser);
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-primary  "
      style={{ zIndex: 9999 }}
    >
      {authUser && authUser.role === "admin" ? (
        <Link
          className="navbar-brand p-2"
          style={{ color: "#03a9f4" }}
          to="/admin/home"
        >
          SOCIAL NETWORK
        </Link>
      ) : (
        <Link className="navbar-brand p-2" style={{ color: "#03a9f4" }} to="/">
          SOCIAL NETWORK
        </Link>
      )}
      {authUser && authUser.roll !== "admin" && (
        <>
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              data-toggle="dropdown"
              href="/"
              aria-expanded="false"
            >
              <i className="far fa-bell text-light" />
              <span className="badge badge-warning navbar-badge">0</span>
            </a>

            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-left">
              <span className="dropdown-item dropdown-header">
                No Notifications
              </span>
              <div className="dropdown-divider" />

              <a href="#" className="dropdown-item">
                <span className="float-right text-muted text-sm">
                  <Notification />
                </span>
              </a>
              <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              data-toggle="dropdown"
              href="#"
              aria-expanded="false"
            >
              <i className="far fa-comments text-light" />
              <span className="badge badge-danger navbar-badge">3</span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
              style={{ left: "inherit", right: 0 }}
            >
              {/* {onlineUsers.length > 0
                ? onlineUsers.map((user, i) => (
                    <a href="/" className="dropdown-item" key={i}>
                      <div className="media">
                        <img
                          src={user.photo ? user.photo.path : DefaultProfile}
                          alt={user.name}
                          className="img-size-50 img-circle mr-3 im-bordred"
                          height="25px"
                        />
                        <div className="media-body">
                          <h3 className="dropdown-item-title">{user.name}</h3>
                          <p className="text-sm text-muted">
                            Online
                            Now
                          </p>
                        </div>
                      </div>
                    </a>
                  ))
                : null} */}
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item dropdown-footer">
                See All Messages
              </a>
            </div>
          </li>{" "}
        </>
      )}
      <button
        className="navbar-toggler text-primary"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="toggleBar">
          <i className="fas fa-bars" id="togglebar"></i>
        </span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul className="navbar-nav ml-auto align-items-center">
          <>
            {authUser && authUser.role === "admin" ? (
              <>
                <Link
                  className="nav-item nav-link menu-link active"
                  to="/admin/users"
                  style={isActive(history, `/admin/users`)}
                >
                  USERS
                </Link>

                <Link
                  className="nav-item nav-link menu-link active"
                  to="/admin/posts"
                  style={isActive(history, `/admin/posts`)}
                >
                  POSTS
                </Link>

                <Link
                  className="nav-item nav-link menu-link active"
                  to={`/user/${authUser._id}`}
                  style={isActive(history, `/user/${authUser._id}`)}
                >
                  {`${authUser.name.toUpperCase()} 'S PROFILE`}
                </Link>

                <Link
                  className="nav-item nav-link menu-link active"
                  to="/signin"
                  style={isActive(history, "/signout")}
                  onClick={() => signout(() => {})}
                >
                  LOGOUT
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="menu-link nav-item nav-link"
                  to="/"
                  style={isActive(history, "/")}
                >
                  HOME
                </Link>

                <Link
                  className="nav-item nav-link menu-link active"
                  to="/users"
                  style={isActive(history, "/users")}
                >
                  USERS
                </Link>

                <Link
                  className="nav-item nav-link menu-link active"
                  to={`/post/create`}
                  style={isActive(history, `/post/create`)}
                >
                  CREATE POST
                </Link>

                {!authUser && (
                  <>
                    <Link
                      className="nav-item nav-link menu-link active"
                      to="/signin"
                      style={isActive(history, "/signin")}
                    >
                      SIGN IN
                    </Link>
                    <Link
                      className="nav-item nav-link menu-link active"
                      to="/signup"
                      style={isActive(history, "/signup")}
                    >
                      SIGN UP
                    </Link>
                  </>
                )}

                {authUser && (
                  <>
                    <Link
                      className="nav-item nav-link menu-link active"
                      to={`/findpeople/${authUser._id}`}
                      style={isActive(history, `/findpeople/${authUser._id}`)}
                    >
                      FIND FRIENDS
                    </Link>

                    <Link
                      className="nav-item nav-link menu-link active"
                      to={`/user/${authUser._id}`}
                      style={isActive(history, `/user/${authUser._id}`)}
                    >
                      {`${authUser.name.toUpperCase()}'S PROFILE`}
                    </Link>

                    <Link
                      className="nav-item nav-link menu-link active"
                      to="/signin"
                      style={isActive(history, "/signout")}
                      onClick={() =>
                        signout(() => {
                          handleLogout();
                        })
                      }
                    >
                      LOGOUT
                    </Link>
                  </>
                )}
              </>
            )}
          </>
        </ul>
      </div>
    </nav>
  );
});

export default class MainRouter extends React.Component {
  constructor(props) {
    super();

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
      this.socket.on(this.state.authUser._id, (data) => {
        fetchMessage(
          this.state.authUser._id,
          data.sender,
          this.state.authUser.token
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
        />

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
          <PrivateRoute path="/post/create" exact component={NewPost} authUser={this.state.authUser}/>
          <Route path="/post/:postId" exact component={SinglePost} />
          <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
          <Route path="/users" exact component={Users} />
          <Route path="/signup" exact component={Signup} />
          <Route
            path="/signin"
            exact
            render={() => (
              <Signin handleAuthUserUpdate={this.handleAuthUserUpdate} />
            )}
          />
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
        </Switch>
      </div>
    );
  }
}
