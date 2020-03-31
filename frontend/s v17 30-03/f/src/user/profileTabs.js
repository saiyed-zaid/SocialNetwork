import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { isAuthenticated } from "../auth/index";

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props;

    return (
      <div>
        <ul
          className="nav nav-tabs"
          style={{ backgroundColor: "#bdbdbd" }}
        >
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
            className="tab-pane fade show active"
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
                    className="p-2 m-0"
                    style={{ borderRadius: "0px" }}
                  >
                    <Link
                      to={`/user/${person._id}`}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start"
                      }}
                    >
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "none",
                          height: "30px",
                          width: "30px"
                        }}
                        className="float-left mr-2 "
                        src={imgPath}
                        alt={person.name}
                        onError={e => {
                          e.target.src = DefaultProfile;
                        }}
                      />
                      <h4 className="lead"> {person.name}</h4>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
          <div
            className="tab-pane fade"
            id="followers"
            role="tabpanel"
            aria-labelledby="followers-tab"
          >
            <hr />

            {followers.length === 0 ? (
              <div>Currently No One Is Following You</div>
            ) : (
              followers.map((person, i) => {
                const imgPath = person.photo
                  ? process.env.REACT_APP_API_URL + "/" + person.photo.path
                  : DefaultProfile;
                return (
                  <div key={i} className="card p-2 mt-1 ">
                    <Link
                      to={`/user/${person._id}`}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        textDecoration: "none"
                      }}
                    >
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "none",
                          height: "30px",
                          width: "30px"
                        }}
                        className="float-left mr-2"
                        src={imgPath}
                        alt={person.name}
                        onError={e => {
                          e.target.src = DefaultProfile;
                        }}
                      />
                      <h4 className="lead"> {person.name}</h4>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
          <div
            className="tab-pane fade"
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
                    className=" p-2 mt-1"
                    style={{ borderRadius: "0px" }}
                  >
                    <Link
                      to={`/post/${post._id}`}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        textDecoration: "none"
                      }}
                    >
                      <h4 className="lead"> {post.title}</h4>
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

export default ProfileTabs;
