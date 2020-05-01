import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import { read, fetchMessage, update } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DefaultPost from "../images/post.jpg";
import DeleteUser from "./deleteUser";
import FollowProfileButton from "./followProfileButton";
import ProfileTabs from "./profileTabs";
import { listByUser } from "../post/apiPost";
import PageLoader from "../components/pageLoader";
import Chattab from "../components/chatTab";
import Modal from "../components/modal/modal";
import EditProfile from "../user/editProfile";

class Profile extends Component {
  constructor() {
    super();
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
    };
  }

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
        console.log("sfcsd", userId, this.state.user._id);
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
  init = (userId) => {
    const token = isAuthenticated().user.token;
    read(userId, token)
      .then((data) => {
        if (data.err) {
          signout(() => {});
          this.setState({ redirectToSignin: true });
        } else {
          let following = this.checkFollow(data);
          this.setState({ user: data, following });
          this.loadPosts(data._id);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
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

  loadPosts = (userId) => {
    const token = isAuthenticated().user.token;
    listByUser(userId, token).then((data) => {
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

  editProfile = () => {
    let getModal = document.getElementById("editprofile");
    getModal.style.display = "block";
    getModal.classList.add("show");
  };
  handleChatBoxDisplay = (e) => {
    e.persist();
    if (!this.state.hasChatBoxDisplay) {
      const token = isAuthenticated().user.token;
      fetchMessage(
        isAuthenticated().user._id,
        e.target.getAttribute("data-userId"),
        token
      )
        .then((result) => {
          this.setState({
            hasChatBoxDisplay: true,
            receiverId: e.target.getAttribute("data-userId"),
            receiverName: e.target.getAttribute("data-name"),
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
    }
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
    return (
      <div className="container-fluid mt-0" style={{ color: "#e6cf23" }}>
        {!user ? (
          <PageLoader />
        ) : (
          <div className="profile p-3">
            {/* ChatBox BEGIN */}
            <div
              id="chat-tab"
              className="justify-content-end align-items-end chat-box"
              style={
                this.state.hasChatBoxDisplay
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              {this.state.hasChatBoxDisplay ? (
                <Chattab
                  senderId={isAuthenticated().user._id}
                  senderName={isAuthenticated().user.name}
                  receiverId={this.state.receiverId}
                  receiverName={this.state.receiverName}
                  handleChatBoxDisplay={this.handleChatBoxDisplay}
                  messages={this.state.messages}
                />
              ) : (
                ""
              )}
            </div>
            {/* ChatBox End */}
            <div className="row">
              <div className="col-md-2">
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "50%",
                  }}
                  className="img-thumbnail"
                  src={photoUrl}
                  onError={(e) => {
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
                  <p>
                    <button
                      className="text-light m-1 "
                      style={{
                        backgroundColor: "transparent",
                        border: "transparent",
                      }}
                      onClick={this.followersModal}
                    >
                      Followers ({user.followers.length}) &nbsp; Following (
                      {user.following.length})
                    </button>
                  </p>
                </div>
                {isAuthenticated().user &&
                isAuthenticated().user._id === user._id ? (
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    {isAuthenticated().user.role === "admin" ? (
                      <button
                        className="btn btn-outline-secondary mr-2 btn-custom"
                        data-toggle="modal"
                        onClick={this.editProfile}
                        // data-target="#exampleModalCenter"
                      >
                        Edit Profile &nbsp;<i className="fas fa-edit "></i>
                      </button>
                    ) : (
                      <>
                        {/*  <Link
                          to={`/user/edit/${user._id}`}
                          className="btn btn-outline-secondary btn-custom"
                        >
                          Edit Profile&nbsp;<i className="fas fa-edit"></i>
                        </Link> */}
                        <button
                          className="btn btn-outline-secondary btn-custom"
                          data-toggle="modal"
                          onClick={this.editProfile}
                          // data-target="#exampleModalCenter"
                        >
                          Edit Profile &nbsp;<i className="fas fa-edit "></i>
                        </button>
                        <Link
                          to={`/post/create`}
                          className="btn btn-outline-secondary btn-custom"
                        >
                          Create Post&nbsp;
                          <i className="fas fa-plus"></i>
                        </Link>
                        <DeleteUser userId={user._id} />
                        <button
                          className="btn btn-outline-secondary btn-custom "
                          onClick={this.handleDeactivateModal}
                        >
                          Deactivate Account &nbsp;
                          <i className="fas fa-times-circle"></i>
                        </button>
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
          <div className="col-md-12 mb-2">
            <hr />
            {/* <ProfileTabs
              followers={user.followers}
              following={user.following}
               posts={posts}
              error={error}
              hasPostStatusUpdated={this.init}
              hasChatBoxDisplay={this.handleChatBoxDisplay}
            /> */}
          </div>
        </div>

        {posts.map((post, i) => (
          <div key={i}>
            <div className="card-body m-2 bg-light ">
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
                    alt="user image"
                  />
                  <span className="username">
                    <Link to={`/post/${post._id}`}>{post.postedBy.name}</Link>
                    {/*  <a href="#" className="float-right btn-tool">
                    <i className="fas fa-times" />
                  </a> */}
                  </span>
                  <span className="description pb-3">
                    Shared Publicly -{new Date(post.created).toDateString()}
                  </span>
                </div>

                {post.photo ? (
                  post.photo.mimetype === "video/mp4" ? (
                    <div className="embed-responsive embed-responsive-16by9 p-0 m-0">
                      <video controls className="embed-responsive-item p-0 m-0">
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

                <p className="pt-2 text-dark">{post.body}</p>
                {isAuthenticated() ? (
                  <button className="btn">
                    <Link to={`/post/${post._id}`}>View More</Link>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        <Modal
          id="editprofile"
          body={<EditProfile userId={this.props.match.params.userId} />}
          title="Edit Profile"
        />
        <Modal
          id="deleteAccount"
          body="Are You Sure You Want To Deactivate Your Account ? "
          buttonText="Deactivate"
          buttonClick={() => this.handleUserStatusChange(user)}
          show
        />
        {isAuthenticated() ? (
          <Modal
            id="followersModal"
            body={
              <ProfileTabs
                followers={user.followers}
                following={user.following}
                // posts={posts}
                error={error}
                hasPostStatusUpdated={this.init}
                hasChatBoxDisplay={this.handleChatBoxDisplay}
              />
            }
          />
        ) : null}
      </div>
    );
  }
}

export default Profile;
