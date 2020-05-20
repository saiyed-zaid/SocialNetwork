import React, { Component } from "react";
import { isAuthenticated, signout } from "../auth/index";
import { Redirect } from "react-router-dom";
import { update } from "./apiUser";
import { update as updatePost } from "../post/apiPost";
import DefaultProfile from "../images/avatar.jpg";
import FollowProfileButton from "./followProfileButton";
import Spinner from "../ui-components/Spinner";
import Chattab from "../components/chatTab";
import Modal from "../components/modal/modal";
import EditProfile from "./editProfile";
import Postcard from "../components/posts/index";
import GoToTop from "../ui-components/goToTop";
import ProfileTabs from "./profileTabs";

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
    const token = this.props.authUser.token;
    const data = await this.props.read(userId, token);

    if (data.err) {
      alert("logout from profile");
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
          this.init(post.postedBy._id);
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
  showFollowList = () => {
    let getModal = document.getElementById("followersmodal");
    getModal.style.display = "block";
    getModal.classList.add("show");
  };

  render() {
    const { redirectToSignin, user, posts } = this.state;
    const photoUrl = user._id && user.photo ? `${user.photo}` : DefaultProfile;

    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    if (this.state.isLoading) {
      return this.state.isLoading && <Spinner />;
    }

    return (
      <div
        className="bg-dark position-relative rounded"
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
              handleChatBoxDisplay={this.handleChatBoxDisplay}
              fetchMessage={this.props.fetchMessage}
            />
          </div>
        )}
        {/* END DISPLAY CHATBOX */}
        <div className="wrapper">
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
            {this.state.user.isLoggedIn && (
              <span
                className="badge badge-pill badge-success"
                style={{
                  position: "absolute",
                  left: "82%",
                  top: "80%",
                }}
              >
                &nbsp;
              </span>
              
            )}
          </div>
        </div>

        <div className="jumbotron text-center">
          <h1 className="display-4">Hello, {this.state.user.name}!</h1>
          <p className="lead" style={{ color: "#b7b7b7" }}>
            {this.state.user.about}
          </p>
          <hr className="my-4"></hr>
          {/* Follow/Following Details */}
          <div
            className="d-flex justify-content-center m-3 text-center"
            onClick={this.showFollowList}
          >
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
          {
            this.props.authUser._id !== this.state.user._id && (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
                handleChatBoxDisplay={this.handleChatBoxDisplay}
              />
            ) /* || (
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
          ) */
          }
          <hr className="my-4" />
          {/* Display Posts */}
          <div className="row justify-content-md-center">
            {posts.map((post, i) => (
              <Postcard
                post={post}
                profile
                handlePostStatusChange={this.handlePostStatusChange}
              />
            ))}
          </div>
          {/*END POST RENDER */}
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
          {isAuthenticated() ? (
            <Modal
              id="followersmodal"
              body={
                <ProfileTabs
                  followers={user.followers}
                  following={user.following}
                  hasPostStatusUpdated={this.init}
                  hasChatBoxDisplay={this.handleChatBoxDisplay}
                />
              }
              title="Following And Followers"
              style={{padding: "0 !important"} }
            />
          ) : null}
        </div>
        <GoToTop />
      </div>
    );
  }
}
export default Profile;
