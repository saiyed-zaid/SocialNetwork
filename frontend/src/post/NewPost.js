import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      prevPhoto: "",
      loading: false,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  handleChange = name => event => {
    this.setState({ error: "" });
    if (name === "photo") {
      this.setState({ prevPhoto: event.target.files[0] });
    }
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (fileSize > 1000000000) {
      this.setState({ error: "Photo Must Be Smaller then 100kb" });
      return false;
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All Fields Are Required", loading: false });
      return false;
    }

    return true;
  };

  clickSubmit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().user.token;

      create(userId, token, this.postData).then(data => {
        if (data.msg) {
          this.setState({ error: data.msg });
        } else {
          console.log("data", data);
        }
      });
    }
  };

  newPostForm = (title, body) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap"
        }}
      >
        <div>
          <div className="form-group">
            <label className="bmd-label-floating">Preview Post Photo</label>
            <img
              src={
                this.state.prevPhoto
                  ? URL.createObjectURL(this.state.prevPhoto)
                  : ""
              }
              alt=""
              className="form-control"
              style={{
                height: "auto",
                width: "300px",
                objectFit: "scale-down"
              }}
            />
          </div>
        </div>
        <form method="post" className="col-md-6">
          <div className="form-group  ">
            <label className="bmd-label-floating">Post Photo</label>
            <input
              onChange={this.handleChange("photo")}
              type="file"
              accept="image/*"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-floating">Title</label>
            <input
              onChange={this.handleChange("title")}
              type="text"
              className="form-control"
              value={title}
              name="title"
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-floating">Body</label>
            <textarea
              onChange={this.handleChange("body")}
              className="form-control"
              value={body}
              name="body"
            />
          </div>

          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary"
          >
            Create Post
          </button>
        </form>
      </div>
    );
  };

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container-fluid p-0">
        <div className="jumbotron p-3">
          <h2>Create A New Post</h2>
        </div>
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

        <div className="pl-3">{this.newPostForm(title, body)}</div>
      </div>
    );
  }
}

export default NewPost;
