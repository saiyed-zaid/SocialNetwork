import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

/**
 * If Anyone Enter In Page Which Needs User Login
 * This Fuction Wil Redirect the User to Sign In
 */

const PrivateRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} authUser={authUser} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
