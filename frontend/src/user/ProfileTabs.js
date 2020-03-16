import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DefaultProfile } from "../images/avatar.jpg";

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts, error } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h5 className="text-primary">
              Following ({following ? following.length : 0})
            </h5>
            <hr />
            {following.map((person, i) => {
              const imgPath = person.photo
                ? process.env.REACT_APP_API_URL + "/" + person.photo.path
                : DefaultProfile;
              return (
                <div
                  key={i}
                  className="card p-2 m-1"
                  style={{ borderRadius: "0px" }}
                >
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
                      className="float-left mr-2 "
                      src={imgPath}
                      alt={person.name}
                    />
                    <h4 className="lead"> {person.name}</h4>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            <h5 className="text-primary">
              Followers ({followers ? followers.length : 0})
            </h5>
            <hr />

            {followers.map((person, i) => {
              const photoUrl = person.photo
                ? person.photo.path
                : DefaultProfile;
              return (
                <div
                  key={i}
                  className="card p-2 mt-1"
                  style={{ borderRadius: "0px" }}
                >
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
                      src={`${process.env.REACT_APP_API_URL}/${photoUrl}`}
                      alt={person.name}
                    />
                    <h4 className="lead"> {person.name}</h4>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            {" "}
            <h5 className="text-primary">
              Posts ({posts ? posts.length : 0}){" "}
            </h5>
            <hr />
            {posts.length === 0 ? (
              <div>{error}</div>
            ) : (
              posts.map((post, i) => {
                return (
                  <div
                    key={i}
                    className="card p-2 mt-1"
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
