import React from "react";
import ReactDOM from "react-dom";

import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";
import Notification from "./components/Notification";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#e6cf23" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  let date = new Date();
  return ReactDOM.createPortal(
    <nav
      className="navbar navbar-expand-lg navbar-light bg-primary  "
      style={{ zIndex: 9999 }}
    >
      {isAuthenticated() && isAuthenticated().user.role === "admin" ? (
        <Link
          className="navbar-brand p-2 "
          style={{ color: "#03a9f4" }}
          to="/admin/home"
        >
          SOCIAL NETWORK
        </Link>
      ) : (
        <Link className="navbar-brand p-2 " style={{ color: "#03a9f4" }} to="/">
          SOCIAL NETWORK
        </Link>
      )}
      {isAuthenticated() && isAuthenticated().user.roll !== "admin" ? (
        <ul className="nav nav-pills mr-auto justify-content-end">
          <li className="nav-item  dropdown">
            <a
              className="nav-link text-light"
              href="/"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-bell"></i>
              <span className="badge badge-light">0</span>
            </a>
            <ul className="dropdown-menu">
              <li className="head text-light bg-dark">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-12">
                    <span>Notifications (3)</span>
                    <a href="" className="float-right text-light">
                      Mark all as read
                    </a>
                  </div>
                </div>
              </li>
              <li /* className="notification-box p-2" */>
                {/* <div className="row">
                <div className="col-lg-8 col-sm-8 col-8"> */}
                <Notification />
                {/*  </div>
              </div> */}
              </li>
              <li className="footer bg-dark text-center">
                <a href="/" className="text-light">
                  View All
                </a>
              </li>
            </ul>
          </li>
        </ul>
      ) : null}
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
            {isAuthenticated() && isAuthenticated().user.role === "admin" ? (
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
                  to={`/user/${isAuthenticated().user._id}`}
                  style={isActive(
                    history,
                    `/user/${isAuthenticated().user._id}`
                  )}
                >
                  {`${isAuthenticated().user.name.toUpperCase()} 'S PROFILE`}
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

                {!isAuthenticated() && (
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
                {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                  <Link
                    className="nav-item nav-link menu-link active"
                    to={`/admin`}
                    style={isActive(history, `/admin`)}
                  >
                    ADMIN
                  </Link>
                )}
                {isAuthenticated() && (
                  <>
                    <Link
                      className="nav-item nav-link menu-link active"
                      to={`/findpeople/${isAuthenticated().user._id}`}
                      style={isActive(
                        history,
                        `/findpeople/${isAuthenticated().user._id}`
                      )}
                    >
                      FIND FRIENDS
                    </Link>

                    <Link
                      className="nav-item nav-link menu-link active"
                      to={`/user/${isAuthenticated().user._id}`}
                      style={isActive(
                        history,
                        `/user/${isAuthenticated().user._id}`
                      )}
                    >
                      {`${isAuthenticated().user.name.toUpperCase()}'S PROFILE`}
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
                )}
              </>
            )}
          </>
        </ul>
      </div>
    </nav>,
    document.getElementById("navbar-div")
  );
};

export default withRouter(Menu);
