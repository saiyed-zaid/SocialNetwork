import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./DeleteUser";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false
    };
  }

  init = userId => {
    const token = isAuthenticated().user.token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    //console.log("user id from route params", this.props.match.params.userId);
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    //console.log("user id from route params", this.props.match.params.userId);
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user } = this.state;
    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    if (redirectToSignin) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <h2 className="mb-5 mt-4">Profile</h2>
        <div className="row">
          <div className="col-md-6">
            <img
              style={{ height: "200px", width: "200px" }}
              className="img-thumbnail"
              src={photoUrl}
              onError={i => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          </div>
          <div className="col-md-6">
            <div className="lead mt-2">
              <p>Hey {user.name}</p>
              <p>Email : {user.email}</p>
              <p>Joined {new Date(user.created).toDateString()}</p>
            </div>
            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
              <div className="d-inline-block">
                <Link
                  to={`/user/edit/${user._id}`}
                  className="btn btn-raised btn-success mr-5"
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
