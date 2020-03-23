import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/post.jpg";

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
          this.setState({ redirectToProfile: true });
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
            <img
              src={
                this.state.prevPhoto
                  ? URL.createObjectURL(this.state.prevPhoto)
                  : DefaultPost
              }
              alt=""
              className="form-control"
              style={{
                height: "350px",
                maxWidth: "350px",
                objectFit: "scale-down"
              }}
            />
          </div>
        </div>
        <form method="post" className="col-md-6">
          <div className="form-group">
            <input
              accept="image/*"
              className="form-control-file"
              type="file"
              onChange={this.handleChange("photo")}
            />
          </div>

          <div className="form-group">
            <input
              onChange={this.handleChange("title")}
              className="form-control"
              type="text"
              value={title}
              name="title"
              placeholder="Post Title"
            />
          </div>

          <div className="form-group">
            <textarea
              onChange={this.handleChange("body")}
              className="form-control"
              value={body}
              name="body"
              placeholder="Post Description"
            />
          </div>

          <button className="btn btn-primary" onClick={this.clickSubmit}>
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
          <h4>Create A New Post</h4>
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
