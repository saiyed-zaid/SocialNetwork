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
            <h3 className="text-primary">Following </h3>
            <hr />
            {following.map((person, i) => {
              const imgPath = person.photo
                ? process.env.REACT_APP_API_URL + "/" + person.photo.path
                : DefaultProfile;
              return (
                <div
                  key={i}
                  className="card p-2 mt-1"
                  style={{ backgroundColor: "black" }}
                >
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black"
                        }}
                        className="float-left mr-2 "
                        height="30px"
                        src={imgPath}
                        width="30px"
                        alt={person.name}
                      />
                      <div style={{ color: "white" }}>
                        <h4 className="lead"> {person.name}</h4>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Followers </h3>
            <hr />

            {followers.map((person, i) => {
              const photoUrl = person.photo
                ? person.photo.path
                : DefaultProfile;
              return (
                <div
                  key={i}
                  className="card p-2 mt-1"
                  style={{ backgroundColor: "black" }}
                >
                  <div>
                    <Link to={`/user/${person._id}`}>
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black"
                        }}
                        className="float-left mr-2"
                        height="30px"
                        width="30px"
                        src={`${process.env.REACT_APP_API_URL}/${photoUrl}`}
                        alt={person.name}
                      />
                      <div style={{ color: "white" }}>
                        <h4 className="lead"> {person.name}</h4>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            {" "}
            <h3 className="text-primary">Posts </h3>
            <hr />
            {posts.length === 0 ? (
              <div>{error}</div>
            ) : (
              posts.map((post, i) => {
                return (
                  <div
                    key={i}
                    className="card p-2 mt-1"
                    style={{ backgroundColor: "black" }}
                  >
                    <div>
                      <Link to={`/post/${post._id}`}>
                        <div style={{ color: "white" }}>
                          <h4 className="lead"> {post.title}</h4>
                        </div>
                      </Link>
                    </div>
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
