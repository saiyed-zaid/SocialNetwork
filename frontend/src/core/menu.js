import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#000000" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <Link className="navbar-brand" to="/">
          Social Network
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <>
              {isAuthenticated() && isAuthenticated().user.role === "admin" ? (
                <>
                  <Link
                    className="nav-item nav-link active"
                    to="/admin/home"
                    style={isActive(history, `/admin/home`)}
                  >
                    Home
                  </Link>

                  <Link
                    className="nav-item nav-link active"
                    to="/admin/users"
                    style={isActive(history, `/admin/users`)}
                  >
                    Users
                  </Link>

                  <Link
                    className="nav-item nav-link active"
                    to="/admin/posts"
                    style={isActive(history, `/admin/posts`)}
                  >
                    Posts
                  </Link>

                  <Link
                    className="nav-item nav-link active"
                    to={`/user/${isAuthenticated().user._id}`}
                    style={isActive(
                      history,
                      `/user/${isAuthenticated().user._id}`
                    )}
                  >
                    {`${isAuthenticated().user.name}'s Profile`}{" "}
                  </Link>

                  <Link
                    className="nav-item nav-link active"
                    to="/signin"
                    style={isActive(history, "/signout")}
                    onClick={() => signout(() => {})}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="nav-item nav-link active"
                    to="/"
                    style={isActive(history, "/")}
                  >
                    Home{" "}
                  </Link>

                  <Link
                    className="nav-item nav-link active"
                    to="/users"
                    style={isActive(history, "/users")}
                  >
                    Users
                  </Link>

                  <Link
                    className="nav-item nav-link active"
                    to={`/post/create`}
                    style={isActive(history, `/post/create`)}
                  >
                    Create Post
                  </Link>

                  {!isAuthenticated() && (
                    <>
                      <Link
                        className="nav-item nav-link active"
                        to="/signin"
                        style={isActive(history, "/signin")}
                      >
                        Sign In
                      </Link>
                      <Link
                        className="nav-item nav-link active"
                        to="/signup"
                        style={isActive(history, "/signup")}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                  {isAuthenticated() &&
                    isAuthenticated().user.role === "admin" && (
                      <Link
                        className="nav-item nav-link active"
                        to={`/admin`}
                        style={isActive(history, `/admin`)}
                      >
                        Admin
                      </Link>
                    )}
                  {isAuthenticated() && (
                    <>
                      <Link
                        className="nav-item nav-link active"
                        to={`/findpeople/${isAuthenticated().user._id}`}
                        style={isActive(
                          history,
                          `/findpeople/${isAuthenticated().user._id}`
                        )}
                      >
                        Find Friends
                      </Link>

                      <Link
                        className="nav-item nav-link active"
                        to={`/user/${isAuthenticated().user._id}`}
                        style={isActive(
                          history,
                          `/user/${isAuthenticated().user._id}`
                        )}
                      >
                        {`${isAuthenticated().user.name}'s Profile`}
                      </Link>

                      <Link
                        className="nav-item nav-link active"
                        to="/signin"
                        style={isActive(history, "/signout")}
                        onClick={() => signout(() => {})}
                      >
                        Logout
                      </Link>
                    </>
                  )}
                </>
              )}
            </>{" "}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default withRouter(Menu);
