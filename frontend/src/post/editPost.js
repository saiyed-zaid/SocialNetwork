import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/post.jpg";

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      photo: "",
      prevPhoto: ""
    };
  }
  init = postId => {
    singlePost(postId).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
          photo: data.photo ? data.photo.path : DefaultPost
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  handleChange = name => event => {
    this.setState({ error: "" });
    if(name === "photo")
    {
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
      const postId = this.state.id;
      const token = isAuthenticated().user.token;

      update(postId, token, this.postData).then(data => {
        if (data.msg) {
          this.setState({ error: data.msg });
        } else {
          this.setState({
            title: "",
            body: "",
            redirectToProfile: true,
            loading: false
          });
        }
      });
    }
  };

  editPostForm = (title, body) => {
    return (
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
          Update Post
        </button>
      </form>
    );
  };
  render() {
    const {
      id,
      title,
      body,
      redirectToProfile,
      error,
      loading,
      photo
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    const photoUrl = id
      ? `${process.env.REACT_APP_API_URL}/${photo}`
      : DefaultPost;
    return (
      <div className="container">
        <h2>{title}</h2>
        <img
          style={{ height: "200px", width: "200px" }}
          className="img-thumbnail"
          src={ (!this.state.prevPhoto)?photoUrl:URL.createObjectURL(this.state.prevPhoto)}
          // onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={title}
        />
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
        {this.editPostForm(title, body)}
      </div>
    );
  }
}

export default EditPost;
