import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { TextField, Button, IconButton } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

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

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().user.token;

      update(userId, token, this.userData).then(data => {
        if (data.msg) {
          this.setState({ error: data.msg });
        } else if (isAuthenticated().user.role === "admin") {
          this.setState({
            redirectToProfile: true
          });
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
          <div
            style={{
              borderRadius: "5px"
            }}
          >
            <input
              style={{ display: "none" }}
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={this.handleChange("photo")}
            />

            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>

            <label className="bmd-label-floating">Select Profile Photo </label>
          </div>

          <div className="form-group">
            <TextField
              id="outlined-basic"
              label="Name"
              size="small"
              fullWidth
              variant="outlined"
              onChange={this.handleChange("name")}
              type="text"
              className="form-control"
              value={name}
              name="name"
            />
          </div>

          <div className="form-group">
            <TextField
              id="outlined-basic"
              label="Email"
              size="small"
              fullWidth
              variant="outlined"
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
              name="email"
            />
          </div>
          <div className="form-group">
            <TextField
              id="outlined-multiline-static"
              label="About"
              multiline
              fullWidth
              rows="4"
              variant="outlined"
              onChange={this.handleChange("about")}
              className="form-control"
              value={about}
              name="about"
            />
          </div>
          <div className="form-group">
            <TextField
              id="outlined-basic"
              label="Password"
              size="small"
              fullWidth
              variant="outlined"
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
              name="password"
            />
          </div>
          <Button
            class="primary"
            variant="outlined"
            color="primary"
            onClick={this.clickSubmit}
          >
            Update Profile
          </Button>
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
          className="alert alert-danger alert-dismissible fade show col-md-4"
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
        <div
          className="container-fluid p-0"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap"
          }}
        >
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
