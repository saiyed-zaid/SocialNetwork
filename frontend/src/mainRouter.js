import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/home";
import Menu from "./core/menu";
import Signup from "./user/signup";
import Signin from "./user/signin";
import Profile from "./user/profile";
import FindPeople from "./user/findPeople";
import Users from "./user/users";
import EditProfile from "./user/editProfile";
import NewPost from "./post/newPost";
import SinglePost from "./post/singlePost";
import EditPost from "./post/editPost";
import ForgotPassword from "./user/forgotPassword";
import ResetPassword from "./user/resetPassword";
import Admin from "./admin/admin";
import AdminUsers from "./admin/users";
import AdminPosts from "./admin/posts";
import AdminHome from "./admin/admin";

import PrivateRoute from "./auth/privateRoute";

const MainRouter = props => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route exact path="/admin/posts" component={AdminPosts} />
        <Route exact path="/admin/users" component={AdminUsers} />
        <Route exact path="/admin/home" component={AdminHome} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route
          exact
          path="/reset-password/:resetPasswordToken"
          component={ResetPassword}
        />
        <PrivateRoute path="/post/create" exact component={NewPost} />
        <Route path="/post/:postId" exact component={SinglePost} />
        <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
        <Route path="/users" exact component={Users} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <PrivateRoute path="/user/edit/:userId" exact component={EditProfile} />
        <PrivateRoute path="/findpeople/:userId" exact component={FindPeople} />
        <PrivateRoute path="/user/:userId" exact component={Profile} />
      </Switch>
    </div>
  );
};
export default MainRouter;
