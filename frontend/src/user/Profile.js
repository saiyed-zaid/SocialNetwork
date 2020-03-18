import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./deleteUser";
import FollowProfileButton from "./followProfileButton";
import ProfileTabs from "./profileTabs";
import { listByUser } from "../post/apiPost";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { followers: [], following: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: []
    };
  }

  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;

    callApi(userId, token, this.state.user._id)
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            user: data,
            following: !this.state.following,
            followers: !this.state.followers
          });
        }
      })
      .catch();
  };

  init = userId => {
    const token = isAuthenticated().user.token;
    read(userId, token).then(data => {
      if (data.msg) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().user.token;
    listByUser(userId, token).then(data => {
      if (data.msg) {
        this.setState({ error: data.msg });
      } else {
        this.setState({ posts: data.posts });
      }
    });
  };
  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user, posts, error } = this.state;
    const photoUrl =
      user._id && user.photo
        ? `${process.env.REACT_APP_API_URL}/${user.photo.path}`
        : DefaultProfile;

    if (redirectToSignin) return <Redirect to="/signin" />;
    return (
      <div className="container-fluid mt-1">
        <div
          className="profile p-2"
          style={{
            border: "none",
            backgroundColor: "rgba(223, 223, 223, 0.37)"
          }}
        >
          <div className="row">
            <div className="col-md-2">
              <img
                style={{ height: "200px", width: "200px", borderRadius: "50%" }}
                className="img-thumbnail"
                src={photoUrl}
                alt={user.name}
                onError={e => {
                  e.target.src = DefaultProfile;
                }}
              />
            </div>
            <div className="col-md-10">
              <div className="mt-2">
                <p>Hey {user.name}</p>
                <p>Email : {user.email}</p>
                <p>Joined {new Date(user.created).toDateString()}</p>
              </div>
              {isAuthenticated().user &&
              isAuthenticated().user._id === user._id ? (
                <div className="d-inline-block">
                  <Link
                    to={`/post/create`}
                    className="btn btn-outline-secondary mr-2 btn-custom"
                  >
                    Create Post &nbsp;
                    <i className="fa fa-plus-square"></i>
                  </Link>
                  <Link
                    to={`/user/edit/${user._id}`}
                    className="btn btn-outline-secondary mr-2 btn-custom"
                  >
                    Edit Profile &nbsp;<i className="fa fa-edit "></i>
                  </Link>
                  <DeleteUser userId={user._id} />
                </div>
              ) : (
                <FollowProfileButton
                  following={this.state.following}
                  onButtonClick={this.clickFollowButton}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
            <div className="card mt-5 w-100">
              <div className="card-body">
                <h5 className="card-title">Admin</h5>
                <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                <div>
                  <Link
                    className="btn btn-outline-secondary btn-custom"
                    to={`/user/edit/${user._id}`}
                  >
                    Edit Profile &nbsp; <i className="fa fa-edit"></i>
                  </Link>
                  &nbsp;&nbsp;
                  <DeleteUser userId={user._id} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p>{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
              error={error}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
