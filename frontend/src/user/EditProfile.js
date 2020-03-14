import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: "",
      photo: ""
    };
  }

  init = userId => {
    const token = isAuthenticated().user.token;

    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about,
          photo: data.photo ? data.photo.path : DefaultProfile
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value });
  };

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 1000000000) {
      this.setState({ error: "Photo Must Be Smaller then 100kb" });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name Is Required", loading: false });
      return false;
    }
    if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
      this.setState({ error: "A Valid Email Is Required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "password Must be 6 character Long",
        loading: false
      });
      return false;
    }
    return true;
  };

  clickSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().user.token;

      update(userId, token, this.userData).then(data => {
        if (data.msg) {
          this.setState({ error: data.msg });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  editForm = (name, email, password, about) => {
    return (
      <div className=" col-md-6">
        <form method="post">
          <div className="form-group">
            <label className="bmd-label-floating">Profile Photo</label>
            <input
              onChange={this.handleChange("photo")}
              type="file"
              accept="image/*"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-floating">Name</label>
            <input
              onChange={this.handleChange("name")}
              type="text"
              className="form-control"
              value={name}
              name="name"
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-floating">Email</label>
            <input
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
              name="email"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-floating">About</label>
            <textarea
              onChange={this.handleChange("about")}
              className="form-control"
              value={about}
              name="about"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-floating">Password</label>
            <input
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
              name="password"
            />
          </div>
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary"
          >
            Update
          </button>
        </form>
      </div>
    );
  };

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about,
      photo
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    const photoUrl = id
      ? `${process.env.REACT_APP_API_URL}/${photo}`
      : DefaultProfile;

    return (
      <div>
        <div className="jumbotron p-3">
          <h2>Edit Profile</h2>
        </div>
        <div
          className="container-fluid p-0"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap"
          }}
        >
          <div
            className="alert alert-danger alert-dismissible fade show"
            style={{ display: error ? "" : "none" }}
          >
            {error}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            ""
          )}

          <img
            style={{ height: "200px", width: "200px" }}
            className="img-thumbnail"
            src={photoUrl}
            onError={i => (i.target.src = `${DefaultProfile}`)}
            alt={name}
          />
          {this.editForm(name, email, password, about)}
        </div>
      </div>
    );
  }
}

export default EditProfile;
