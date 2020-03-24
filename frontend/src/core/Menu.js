import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "white", borderBottom: "3px solid transparent" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg  bg-primary">
        <Link className="navbar-brand p-2 " style={{ color: "#03a9f4" }} to="/">
          SOCIAL NETWORK
        </Link>
        <button
          className="navbar-toggler text-primary"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="ellipsis-v "></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <>
              {isAuthenticated() && isAuthenticated().user.role === "admin" ? (
                <>
                  <Link
                    className="nav-item nav-link menu-link active"
                    to="/admin/home"
                    style={isActive(history, `/admin/home`)}
                  ></Link>

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
                    {`${isAuthenticated().user.name.toUpperCase()} 'S PROFILE`}{" "}
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
                    className="nav-item nav-link menu-link active"
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
                  {isAuthenticated() &&
                    isAuthenticated().user.role === "admin" && (
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
            </>{" "}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default withRouter(Menu);
