import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Notification from "../../core/components/notification";
import avatar from "../../images/avatar.jpg";
import { Link } from "react-router-dom";
import MsgNotification from "../../core/components/messageNotification";

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
                      <MsgNotification
                        handleOpen={handleChatOpen}
                        history={history}
                      />
                      <Notification authUser={authUser} />
                    </>
                  )}
                  <li className="nav-item dropdown">
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

export default Navbar;
