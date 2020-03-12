import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DefaultProfile } from "../images/avatar.jpg";

class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;

    return (
      <div>
        {/* {console.log('data__',following)} */}
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Following </h3>
            <hr />
            {following.map((person, i) => {
              /*  const imgPath =
                (person._id && person.photo)
                  ? process.env.REACT_APP_API_URL + "/" + person.photo.path
                  : DefaultProfile; */
              const imgPath = person.photo
                ? process.env.REACT_APP_API_URL + "/" + person.photo.path
                : DefaultProfile;
              console.log("PATH_", person);
              return (
                <div key={i}>
                  <div>
                    {/* {console.log("person_", person.photo.path)} */}
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
          <div className="col-md-4"> </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
