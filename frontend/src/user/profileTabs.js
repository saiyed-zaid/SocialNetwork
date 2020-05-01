import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuthenticated } from "../auth/index";
import { update } from "../post/apiPost";
import { unfollow } from "../user/apiUser";
import Toast from "../components/Toast";

class ProfileTabs extends Component {
  constructor(props) {
    super(props);
  }

  handleUserUnfollow = (e) => {
    const unfollowId = e.target.getAttribute("data-userId");
    if (unfollowId) {
      unfollow(
        isAuthenticated().user._id,
        isAuthenticated().user.token,
        unfollowId
      )
        .then((result) => {
          if (result) {
            this.props.hasPostStatusUpdated(isAuthenticated().user._id);
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    }
  };

  handlePostStatus = (e) => {
    const formData = new FormData();
    const postId = e.target.getAttribute("data-post-id");
    const postStatus = e.target.getAttribute("data-post-status");
    if (postStatus == "true") {
      formData.set("status", false);
      formData.append("disabledBy", isAuthenticated().user._id);
    } else {
      formData.set("status", true);
      formData.append("disabledBy", "");
    }

    update(postId, isAuthenticated().user.token, formData)
      .then((result) => {
        this.props.hasPostStatusUpdated(isAuthenticated().user._id);
      })
      .catch((err) => {
        if (err) {
          alert(err);
        }
      });
  };

  render() {
    const { following, followers, posts } = this.props;

    return (
      <div>
        <ul className="nav nav-tabs" style={{ backgroundColor: "#bdbdbd" }}>
          <li className="nav-item col-md-4 pl-0 pr-0">
            <a
              className="nav-link active"
              id="following-tab"
              data-toggle="tab"
              href="#following"
              role="tab"
              aria-controls="following"
              aria-selected="true"
            >
              Following ({following ? following.length : 0})
            </a>
          </li>
          <li className="nav-item col-md-4 pl-0 pr-0">
            <a
              className="nav-link"
              id="followers-tab"
              data-toggle="tab"
              href="#followers"
              role="tab"
              aria-controls="followers"
              aria-selected="false"
            >
              Followers ({followers ? followers.length : 0})
            </a>
          </li>
          <li className="nav-item col-md-4 pl-0 pr-0">
            <a
              className="nav-link"
              id="posts-tab"
              data-toggle="tab"
              href="#posts"
              role="tab"
              aria-controls="posts"
              aria-selected="false"
            >
              Posts ({posts ? posts.length : 0})
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show bg-dark active"
            id="following"
            role="tabpanel"
            aria-labelledby="following-tab"
          >
            <hr />
            {following.length === 0 ? (
              <div>
                You Are Not Following Anybody.
                <Link to={`/findpeople/${isAuthenticated().user._id}`}>
                  Find New Friends Here
                </Link>
              </div>
            ) : (
              following.map((person, i) => {
                const imgPath = person.photo
                  ? process.env.REACT_APP_API_URL + "/" + person.photo.path
                  : DefaultProfile;
                return (
                  <div
                    key={i}
                    className="p-2 mt-1"
                    style={{
                      borderRadius: "0px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#2b3035",
                    }}
                  >
                    <Link
                      to={`/user/${person._id}`}
                      style={{
                        display: "flex",
                        flex: "1",
                      }}
                    >
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "none",
                          height: "30px",
                          width: "30px",
                        }}
                        className="float-left mr-2 "
                        src={imgPath}
                        alt={person.name}
                        onError={(e) => {
                          e.target.src = DefaultProfile;
                        }}
                      />
                      <h5 style={{ color: "rgb(230, 207, 35)" }}>

                        {person.name}
                        {person.isLoggedIn ? (
                          <span class="badge badge-success">Online </span>
                        ) : (
                          <span class="badge badge-secondary">Offline</span>
                        )}
                      </h5>
                    </Link>
                    {this.props.match.params.userId ===
                    isAuthenticated().user._id ? (
                      <>
                        <button
                          className="btn btn-primary"
                          data-userId={person._id}
                          onClick={this.handleUserUnfollow}
                        >

                          <i class="fas fa-user-minus"></i>
                        </button>
                        <button
                          className="btn btn-primary"
                          data-userId={person._id}
                          data-name={person.name}

                          onClick={this.props.hasChatBoxDisplay}
                        >
                          <i class="fas fa-paper-plane"></i>
                        </button>
                      </>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
          <div
            className="tab-pane fade  bg-dark"
            id="followers"
            role="tabpanel"
            aria-labelledby="followers-tab"
          >
            <hr />
            {followers.length === 0 ? (
              <div>Currently No One Is Following You</div>
            ) : (
              followers.map((follower, i) => {
                const imgPath = follower.user.photo
                  ? process.env.REACT_APP_API_URL +
                    "/" +
                    follower.user.photo.path
                  : DefaultProfile;
                return (
                  <div
                    key={i}
                    className="p-2 mt-1"
                    style={{
                      borderRadius: "0px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "300px",
                    }}
                  >
                    <Link
                      to={`/user/${follower.user._id}`}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        textDecoration: "none",
                      }}
                    >
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "none",
                          height: "30px",
                          width: "30px",
                        }}
                        className="float-left mr-2"
                        src={imgPath}
                        alt={follower.user.name}
                        onError={(e) => {
                          e.target.src = DefaultProfile;
                        }}
                      />
                      <h4 className="lead text-light"> {follower.user.name}</h4>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
          <div
            className="tab-pane fade bg-dark "
            id="posts"
            role="tabpanel"
            aria-labelledby="posts-tab"
          >
            <hr />
            {posts.length === 0 ? (
              <div>There Is No Post</div>
            ) : (
              posts.map((post, i) => {
                return (
                  <div
                    key={i}
                    className="p-2 mt-1"
                    style={{
                      borderRadius: "0px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "300px",
                      backgroundColor: "#2b3035",
                    }}
                  >
                    <Link
                      to={`/post/${post._id}`}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <h4 className="lead text-light"> {post.title}</h4>
                    </Link>
                    {this.props.match.params.userId ===
                    isAuthenticated().user._id ? (
                      <i
                        className={
                          post.status
                            ? "fa fa-eye text-light"
                            : "fa fa-eye-slash text-light"
                        }
                        style={{ cursor: "pointer" }}
                        data-post-id={post._id}
                        data-post-status={post.status}
                        onClick={this.handlePostStatus}
                      ></i>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfileTabs);
