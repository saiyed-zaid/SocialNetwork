import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "black" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <nav className="navbar navbar-dark bg-primary">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link className="nav-link" to="/" style={isActive(history, "/")}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/users"
            style={isActive(history, "/users")}
          >
            Users
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/post/create`}
            className="nav-link"
            style={isActive(history, `/post/create`)}
          >
            Create Post
          </Link>
        </li>
        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signin"
                style={isActive(history, "/signin")}
              >
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signup"
                style={isActive(history, "/signup")}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
        {isAuthenticated() && isAuthenticated().user.role === "admin" && (
          <li className="nav-item">
            <Link
              to={`/admin`}
              style={isActive(history, `/admin`)}
              className="nav-link"
            >
              Admin
            </Link>
          </li>
        )}
        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                to={`/findpeople/${isAuthenticated().user._id}`}
                className="nav-link"
                style={isActive(
                  history,
                  `/findpeople/${isAuthenticated().user._id}`
                )}
              >
                Find Friends
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                className="nav-link"
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              >{`${isAuthenticated().user.name}'s Profile`}</Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signin"
                style={isActive(history, "/signout")}
                onClick={() => signout(() => {})}
              >
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  </div>
);

export default withRouter(Menu);
