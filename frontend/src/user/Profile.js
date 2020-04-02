import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./deleteUser";
import FollowProfileButton from "./followProfileButton";
import ProfileTabs from "./profileTabs";
import { listByUser } from "../post/apiPost";
import PageLoader from "../components/pageLoader";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { followers: [], following: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
      hasPostStatusUpdated: false 
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
    read(userId, token)
      .then(data => {
        if (data.err) {
          signout(() => {});
          this.setState({ redirectToSignin: true });
        } else {
          let following = this.checkFollow(data);
          this.setState({ user: data, following });
          this.loadPosts(data._id);
        }
      })
      .catch(err => {
        if (err) {
          console.log(err);
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

    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className="container-fluid mt-0" style={{ color: "#e6cf23" }}>
        {!user ? (
          <PageLoader />
        ) : (
          <div
            className="profile p-3"
            style={
              {
                /* backgroundColor: "rgba(223, 223, 223, 0.37)" */
              }
            }
          >
            <div className="row">
              <div className="col-md-2">
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "50%"
                  }}
                  className="img-thumbnail"
                  src={photoUrl}
                  onError={e => {
                    e.target.src = DefaultProfile;
                  }}
                  alt={user.name}
                />
              </div>
              <div className="col-md-10">
                <div>
                  <p>Hey {user.name}</p>
                  <p>Email : {user.email}</p>
                  <p>Joined {new Date(user.created).toDateString()}</p>
                  <hr />
                  <p>{user.about}</p>
                </div>
                {isAuthenticated().user &&
                isAuthenticated().user._id === user._id ? (
                  <div
                    className={this.actionButton}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      minHeight: "20px"
                    }}
                  >
                    {isAuthenticated().user.role === "admin" ? (
                      <Link
                        to={`/user/edit/${user._id}`}
                        className="btn btn-outline-secondary mr-2 btn-custom"
                      >
                        Edit Profile &nbsp;<i className="fa fa-edit"></i>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/user/edit/${user._id}`}
                          className="btn btn-outline-secondary mr-2 btn-custom"
                        >
                          Edit Profile &nbsp;<i className="fa fa-edit"></i>
                        </Link>
                        <Link
                          to={`/post/create`}
                          className="btn btn-outline-secondary mr-2 btn-custom"
                        >
                          Create Post &nbsp;
                          <i className="fa fa-plus"></i>
                        </Link>
                        <DeleteUser userId={user._id} />
                      </>
                    )}
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
        )}
        <div>
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
              error={error}
              hasPostStatusUpdated = {this.init}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
