import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuthenticated } from "../auth/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

class ProfileTabs extends Component {
  handleUserUnfollow = async (e) => {
    const unfollowId = e.target.getAttribute("data-userId");
    try {
      if (unfollowId) {
        const result = await this.props.unfollow(
          isAuthenticated().user._id,
          isAuthenticated().user.token,
          unfollowId
        );
        if (result) {
          this.props.hasPostStatusUpdated(isAuthenticated().user._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handlePostStatus = async (e) => {
    const formData = new FormData();
    const postId = e.target.getAttribute("data-post-id");
    const postStatus = e.target.getAttribute("data-post-status");
    if (postStatus === "true") {
      formData.set("status", false);
      formData.append("disabledBy", isAuthenticated().user._id);
    } else {
      formData.set("status", true);
      formData.append("disabledBy", "");
    }
    try {
      const result = await this.props.ipdatePost(
        postId,
        isAuthenticated().user.token,
        formData
      );
      if (result) {
        this.props.hasPostStatusUpdated(isAuthenticated().user._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { following, followers } = this.props;

    return (
      <div>
        <ul
          className="nav nav-tabs bg-light"
          style={{ backgroundColor: "#bdbdbd" }}
        >
          <li className="nav-item col-md-6 pl-0 pr-0">
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
          <li className="nav-item col-md-6 pl-0 pr-0">
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
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show bg-light active"
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
                const imgPath = person.photo ? person.photo : DefaultProfile;
                return (
                  <div
                    key={i}
                    className="p-2 mt-1"
                    style={{
                      borderRadius: "0px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                          <span className="badge badge-success">Online </span>
                        ) : (
                          <span className="badge badge-secondary">Offline</span>
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
                          <FontAwesomeIcon icon={faUserMinus} />
                        </button>
                        <button
                          className="btn btn-primary"
                          data-userId={person._id}
                          data-name={person.name}
                          onClick={this.props.hasChatBoxDisplay}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
          <div
            className="tab-pane fade  bg-light"
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
                  ? follower.user.photo
                  : DefaultProfile;
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: "0px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
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
                      <h4 className="lead text-dark"> {follower.user.name}</h4>
                    </Link>
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
