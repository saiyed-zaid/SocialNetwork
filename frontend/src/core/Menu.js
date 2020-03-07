import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/";
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
        {/* {console.log(isAuthenticated())} */}
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
        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/signout"
                style={isActive(history, "/signout")}
                onClick={() => signout(() => history.push("/"))}
              >
                Logout
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                className="nav-link"
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              >{`${isAuthenticated().user.name}'s Profile`}</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  </div>
);

export default withRouter(Menu);
