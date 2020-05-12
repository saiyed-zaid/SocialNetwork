import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { Redirect, Link } from "react-router-dom";

import { read, fetchMessage, update } from "./apiUser";
import { update as updatePost } from "../post/apiPost";
import DefaultProfile from "../images/avatar.jpg";
import DefaultPost from "../images/post.jpg";
import FollowProfileButton from "./followProfileButton";
import ProfileTabs from "./profileTabs";
import { listByUser } from "../post/apiPost";
// import PageLoader from "../components/pageLoader";

import LoadingRing from "../l1.gif";
import Chattab from "../components/chatTab";
import Modal from "../components/modal/modal";
import EditProfile from "./editProfile";
import TimeAgo from "react-timeago";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { followers: [], following: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
      hasPostStatusUpdated: false,
      hasChatBoxDisplay: false,
      receiverId: undefined,
      receiverName: undefined,
      messages: null,
      isLoading: true,
      post: "",
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  init = async (userId) => {
    const token = isAuthenticated().user.token;
    const data = await this.props.read(userId, token);

    if (data.err) {
      signout(() => {});
      this.setState({ redirectToSignin: true });
    } else {
      let following = this.checkFollow(data);
      this.setState({ user: data, following, isLoading: false });
      this.loadPosts(data._id);
    }
  };

  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      return follower.user._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;

    callApi(userId, token, this.state.user._id)
      .then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            user: data,
            following: !this.state.following,
            followers: !this.state.followers,
          });
        }
      })
      .catch();
  };

  handleDeactivateModal = () => {
    document.getElementById("deleteAccount").style.display = "block";
    document.getElementById("deleteAccount").classList.add("show");
  };

  followersModal = () => {
    document.getElementById("followersModal").style.display = "block";
    document.getElementById("followersModal").classList.add("show");
  };

  handleUserStatusChange = (user) => {
    const userId = user._id;
    let dataToUpdate = user;
    const data = new FormData();

    data.append("status", !dataToUpdate.status);

    update(userId, isAuthenticated().user.token, data)
      .then((result) => {
        if (result.err) {
          console.log("Error=> ", result.err);
        } else {
          this.setState({ users: dataToUpdate });
          document.getElementById("deleteAccount").style.display = "none";
          document.getElementById("deleteAccount").classList.remove("show");
        }
      })
      .catch((err) => {
        if (err) {
          console.log("ERR IN UPDATING", err);
        }
      });
  };

  handlePostStatusChange = (post) => {
    const postId = post._id;
    let dataToUpdate = post;
    const data = new FormData();

    data.append("status", !dataToUpdate.status);

    updatePost(postId, isAuthenticated().user.token, data)
      .then((result) => {
        if (result.err) {
          console.log("Error=> ", result.err);
        } else {
          this.setState({ post: dataToUpdate });
        }
      })
      .catch((err) => {
        if (err) {
          console.log("ERR IN UPDATING", err);
        }
      });
  };

  loadPosts = async (userId) => {
    const token = isAuthenticated().user.token;
    try {
      const response = await this.props.fetchPostsByUser(userId, token);
      if (response.msg) {
        this.setState({ error: response.msg });
      } else {
        this.setState({ posts: response.posts });
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentWillReceiveProps(props) {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  editProfile = () => {
    let getModal = document.getElementById("editprofile");
    getModal.style.display = "block";
    getModal.classList.add("show");
  };

  handleChatBoxDisplay = (e) => {
    e.persist();
    this.setState({
      hasChatBoxDisplay: !this.state.hasChatBoxDisplay,
    });
    /* if (!this.state.hasChatBoxDisplay) {
      const token = this.props.authUser.token;
      fetchMessage(this.props.authUser._id, this.state.user._id, token)
        .then((result) => {
          this.setState({
            hasChatBoxDisplay: true,
            receiverId: this.state.authUser._id,
            receiverName: this.state.authUser.name,
            messages: result,
          });
        })
        .catch((err) => {
          if (err) {
            console.log("Error while fetching record");
          }
        });
    } else {
      this.setState({
        hasChatBoxDisplay: false,
      });
    } */
  };

  render() {
    const { redirectToSignin, user, posts, error } = this.state;
    const photoUrl =
      user._id && user.photo
        ? `${process.env.REACT_APP_API_URL}/${user.photo.path}`
        : DefaultProfile;

    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    if (this.state.isLoading) {
      return this.state.isLoading && <img src={LoadingRing} alt="loading" />;
    }

    return (
      <div
        className=" bg-light position-relative rounded"
        style={{ margin: "80px auto 10px auto" }}
      >
        {/* DISPLAY CHATBOX */}
        {this.state.hasChatBoxDisplay && (
          <div
            id="chat-tab"
            className=" d-flex justify-content-end align-items-end chat-box"
          >
            <Chattab
              authUser={this.props.authUser}
              senderId={this.props.authUser._id}
              senderName={this.props.authUser.name}
              receiverId={this.state.user._id}
              receiverName={this.state.user.name}
              messages={this.state.messages}
              handleChatBoxDisplay={this.handleChatClose}
              fetchMessage={this.props.fetchMessage}
            />
          </div>
        )}
        {/* END DISPLAY CHATBOX */}
        <div className="position-absolute profile-photo">
          <img
            src={photoUrl}
            onError={(e) => {
              e.target.src = DefaultProfile;
            }}
            alt={user.name}
            className="rounded-circle"
            style={{ width: "150px" }}
          />
        </div>

        <div className="jumbotron text-center">
          <h1 className="display-4">Hello, {this.state.user.name}!</h1>
          <p className="lead" style={{ color: "#b7b7b7" }}>
            {this.state.user.about}
          </p>
          <hr className="my-4"></hr>

          {/* Follow/Following Details */}
          <div className="d-flex justify-content-center m-3 text-center">
            <p className="lead ml-2">
              <h5 className="card-subtitle mb-2 text-muted">Follower</h5>
              <h6 className="card-title text-warning">
                {this.state.user.followers.length}
              </h6>
            </p>

            <p className="lead ml-2">
              <h5 className="card-subtitle mb-2 text-muted">Following</h5>
              <h6 className="card-title text-warning">
                {this.state.user.following.length}
              </h6>
            </p>

            <p className="lead ml-2">
              <h5 className="card-subtitle mb-2 text-muted">Posts</h5>
              <h6 className="card-title text-warning">
                {this.state.posts.length}
              </h6>
            </p>
          </div>
          {/* End Follow/Following Details */}

          {(this.props.authUser._id !== this.state.user._id && (
            <FollowProfileButton
              following={this.state.following}
              onButtonClick={this.clickFollowButton}
              handleChatBoxDisplay={this.handleChatBoxDisplay}
            />
          )) || (
            <div className="row justify-content-center">
              <div className="form-group">
                <button
                  type="button"
                  onClick={this.editProfile}
                  className="btn btn-primary btn-sm mr-1"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          <hr className="my-4" />

          {/* Display Posts */}

          <div>
            {posts.map((post, i) => (
              <div
                key={i}
                className="d-flex w-100  align-items-center flex-column p-0 m-0"
              >
                {console.log("posts__", post)}
                <div className="card-body m-2 bg-light col-md-7 ">
                  {/* Post */}
                  <div className="post ">
                    <div className="user-block">
                      <img
                        className="img-circle img-bordered-sm"
                        src={
                          post.postedBy.path
                            ? post.postedBy.photo.path
                            : DefaultPost
                        }
                        alt="post"
                      />
                      <span className="username">
                        <Link to={`/post/${post._id}`}>
                          {post.postedBy.name}
                        </Link>
                      </span>
                      <span className="description pb-3">
                        <div className="btn-group ">
                          <button
                            type="button"
                            style={{ boxShadow: "none" }}
                            className="btn"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {post.status ? "Public" : " Private"} &nbsp;
                          </button>
                          <div className="dropdown-menu dropdown-menu-right bg-secondary">
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => this.handlePostStatusChange(post)}
                            >
                              Make Post {!post.status ? "Public" : " Private"}
                            </button>
                          </div>
                        </div>
                        <TimeAgo date={post.created} />
                      </span>
                    </div>

                    {post.photo ? (
                      post.photo.mimetype === "video/mp4" ? (
                        <div className="embed-responsive embed-responsive-16by9 p-0 m-0">
                          <video
                            controls
                            className="embed-responsive-item p-0 m-0"
                          >
                            <source
                              src={`${process.env.REACT_APP_API_URL}/${
                                post.photo ? post.photo.path : DefaultPost
                              }`}
                              type="video/mp4"
                              alt="No Video Found"
                              // onError={e=>e.target.alt="No Video"}
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <img
                          className="card-img-top"
                          src={`${process.env.REACT_APP_API_URL}/${
                            post.photo ? post.photo.path : DefaultPost
                          }`}
                          onError={(i) => (i.target.src = `${DefaultPost}`)}
                          alt={post.name}
                        />
                      )
                    ) : null}

                    <p className="pt-2 ">{post.body}</p>
                    {isAuthenticated() ? (
                      <button className="btn btn-outline-dark">
                        <Link to={`/post/${post._id}`}>View More</Link>
                      </button>
                    ) : null}
                  </div>
                </div>
                <hr className="my-4" />
              </div>
            ))}
            {/*END POST RENDER */}
          </div>
          <Modal
            id="editprofile"
            body={
              <EditProfile
                userId={this.props.match.params.userId}
                update={this.props.update}
                read={this.props.read}
                authUser={this.props.authUser}
                updateUser={this.props.updateUser}
              />
            }
            title="Edit Profile"
          />
        </div>
      </div>
    );
  }
}
export default Profile;
