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
              <Link
                className="nav-link"
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
        ) : (
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={isActive(history, "/")}>
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
                    className="nav-item nav-link menu-link active"
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

                <li className="nav-item">
                  <Link
                    className="nav-link"
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
                </li>
              </>
            )}
          </ul>
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
              />
            )}
          />
          <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
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
        </Switch>
      </div>
    );
  }
}

export default withRouter(MainRouter);
