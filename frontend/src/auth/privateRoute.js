import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

/**
 * If Anyone Enter In Page Which Needs User Login
 * This Fuction Wil Redirect the User to Sign In
 */

const PrivateRoute = ({
  component: Component,
  authUser,
  addPost,
  fetchPostsByUser,
  findPeople,
  update,
  read,
  remove,
  fetchMessage,
  updateUser,
  changePassword,
  replyComment,
  editPost,
  updatePost,
  unfollow,
  follow,
  fetchPost,
  fetchScheduledPosts,
  deleteScheduledPost,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <>
            {console.log(fetchPost)}
            <Component
              {...props}
              authUser={authUser}
              addPost={addPost}
              fetchPostsByUser={fetchPostsByUser}
              findPeople={findPeople}
              update={update}
              read={read}
              remove={remove}
              fetchMessage={fetchMessage}
              updateUser={updateUser}
              changePassword={changePassword}
              replyComment={replyComment}
              editPost={editPost}
              updatePost={updatePost}
              unfollow={unfollow}
              follow={follow}
              fetchPost={fetchPost}
              fetchScheduledPosts={fetchScheduledPosts}
              deleteScheduledPost={deleteScheduledPost}
            />
          </>
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
