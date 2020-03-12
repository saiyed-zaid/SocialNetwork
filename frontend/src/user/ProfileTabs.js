import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DefaultProfile } from "../images/avatar.jpg";

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Following </h3>
            <hr />
            {following.map((person, i) => {
              return (
                <div key={i}>
                  <div>
                    {console.log("person ", person)}
                    <Link to={`/user/${person._id}`}>
                      <img
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black"
                        }}
                        className="float-left mr-2 "
                        height="30px"
                        src={DefaultProfile}
                        width="30px"
                        alt={person.name}
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                      />

                      <div>
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
              return (
                <div key={i}>
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
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                        alt={person.name}
                        //   onError={i => (i.target.src = `${DefaultProfile}`)}
                      />
                      <div>
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
            <hr />{" "}
            {posts.map((post, i) => {
              return (
                <div key={i}>
                  <div>
                    <Link to={`/post/${post._id}`}>
                      <div>
                        <h4 className="lead"> {post.title}</h4>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
