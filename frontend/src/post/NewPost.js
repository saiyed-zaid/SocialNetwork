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
      this.state.prevPhoto = event.target.files[0];
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
      <form method="post">
        <div className="form-group">
          <div className="form-group">
            {console.log('img DATA__',this.state.prevPhoto)}
            <label className="bmd-label-floating">Preview Post Photo</label>
            <img
              src={(this.state.prevPhoto)?URL.createObjectURL(this.state.prevPhoto):''}
              alt=""
              className="form-control"
              style={{ height: "120px", width: "120px" }}
            />
          </div>
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
    );
  };

  render() {
    const {
      title,
      body,
      photo,
      user,
      error,
      loading,
      redirectToProfile
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }
    /* const photoUrl = id
      ? `${process.env.REACT_APP_API_URL}/${photo}`
      : DefaultProfile;
 */
    return (
      <div className="container">
        <h2 className="mb-5 mt-4">Create A New Post</h2>
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

        {/* <img
          style={{ height: "200px", width: "200px" }}
          className="img-thumbnail"
          src={photoUrl}
          // onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        /> */}

        {this.newPostForm(title, body)}
      </div>
    );
  }
}

export default NewPost;
