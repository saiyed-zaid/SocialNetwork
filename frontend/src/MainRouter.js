import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import FindPeople from "./user/FindPeople";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";

const MainRouter = props => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/users" exact component={Users} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <PrivateRoute path="/user/edit/:userId" exact component={EditProfile} />
        <PrivateRoute path="/findpeople" exact component={FindPeople} />
        <PrivateRoute path="/user/:userId" exact component={Profile} />
      </Switch>
    </div>
  );
};
export default MainRouter;
