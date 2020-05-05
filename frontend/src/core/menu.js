import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";
import { getOnlineUsers } from "../user/apiUser";
import Notification from "./components/Notification";
import DefaultProfile from "../images/avatar.jpg";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#e6cf23" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated()) {
      getOnlineUsers(isAuthenticated().user._id, isAuthenticated().user.token)
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            setOnlineUsers(data[0].following);
          }
        })
        .catch();
    }
  }, []);

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
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-left"
              // style={{ left: "inherit", right: 0 }}
            >
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
              {onlineUsers.length > 0
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
                            {/* <i className="far fa-clock mr-1" /> */} Online
                            Now
                          </p>
                        </div>
                      </div>
                    </a>
                  ))
                : null}
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item dropdown-footer">
                See All Messages
              </a>
            </div>
          </li>{" "}
        </>
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
