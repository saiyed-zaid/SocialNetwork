import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#000000" };
  } else return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/*  <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            Social Network
          </Typography>
          <>
            {isAuthenticated() && isAuthenticated().user.role === "admin" ? (
              <>
                <Link
                  style={{ color: "inherit" }}
                  to="/admin/home"
                  style={isActive(history, `/admin/home`)}
                >
                  <Button color="inherit">Home </Button>
                </Link>

                <Link
                  style={{ color: "inherit" }}
                  to="/admin/users"
                  style={isActive(history, `/admin/users`)}
                >
                  <Button color="inherit">Users </Button>
                </Link>

                <Link
                  style={{ color: "inherit" }}
                  to="/admin/posts"
                  style={isActive(history, `/admin/posts`)}
                >
                  <Button color="inherit">Posts </Button>
                </Link>

                <Link
                  style={{ color: "inherit" }}
                  to={`/user/${isAuthenticated().user._id}`}
                  style={isActive(
                    history,
                    `/user/${isAuthenticated().user._id}`
                  )}
                >
                  <Button color="inherit">
                    {`${isAuthenticated().user.name}'s Profile`}{" "}
                  </Button>
                </Link>

                <Link
                  style={{ color: "inherit" }}
                  to="/signin"
                  style={isActive(history, "/signout")}
                  onClick={() => signout(() => {})}
                >
                  <Button color="inherit">Logout</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  style={{ color: "inherit" }}
                  to="/"
                  style={isActive(history, "/")}
                >
                  <Button color="inherit">Home</Button>
                </Link>

                <Link
                  style={{ color: "inherit" }}
                  to="/users"
                  style={isActive(history, "/users")}
                >
                  <Button color="inherit">Users</Button>
                </Link>

                <Link
                  style={{ color: "inherit" }}
                  to={`/post/create`}
                  style={isActive(history, `/post/create`)}
                >
                  <Button color="inherit">Create Post</Button>
                </Link>

                {!isAuthenticated() && (
                  <>
                    <Link
                      style={{ color: "inherit" }}
                      to="/signin"
                      style={isActive(history, "/signin")}
                    >
                      <Button color="inherit">Sign In </Button>
                    </Link>
                    <Link
                      style={{ color: "inherit" }}
                      to="/signup"
                      style={isActive(history, "/signup")}
                    >
                      <Button color="inherit">Sign Up</Button>
                    </Link>
                  </>
                )}
                {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                  <Link
                    style={{ color: "inherit" }}
                    to={`/admin`}
                    style={isActive(history, `/admin`)}
                  >
                    <Button color="inherit">Admin</Button>
                  </Link>
                )}
                {isAuthenticated() && (
                  <>
                    <Link
                      style={{ color: "inherit" }}
                      to={`/findpeople/${isAuthenticated().user._id}`}
                      style={isActive(
                        history,
                        `/findpeople/${isAuthenticated().user._id}`
                      )}
                    >
                      <Button color="inherit">Find Friends</Button>
                    </Link>

                    <Link
                      style={{ color: "inherit" }}
                      to={`/user/${isAuthenticated().user._id}`}
                      style={isActive(
                        history,
                        `/user/${isAuthenticated().user._id}`
                      )}
                    >
                      <Button color="inherit">{`${
                        isAuthenticated().user.name
                      }'s Profile`}</Button>
                    </Link>

                    <Link
                      style={{ color: "inherit" }}
                      to="/signin"
                      style={isActive(history, "/signout")}
                      onClick={() => signout(() => {})}
                    >
                      <Button color="inherit">Logout</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Menu);
