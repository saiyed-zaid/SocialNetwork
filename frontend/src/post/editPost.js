import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import { TextField, Button, IconButton } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

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
      photo: ""
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
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    console.log("pgohtos", value);

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

    if (this.isValid()) {
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
          <label className="bmd-label-floating">Select Post Photo </label>
        </div>

        <div className="form-group">
          <TextField
            id="outlined-basic"
            label="Title"
            size="small"
            fullWidth
            variant="outlined"
            onChange={this.handleChange("title")}
            type="text"
            className="form-control"
            value={title}
            name="title"
          />
        </div>

        <div className="form-group">
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            fullWidth
            rows="4"
            variant="outlined"
            onChange={this.handleChange("body")}
            className="form-control"
            value={body}
            name="body"
          />
        </div>

        <Button variant="outlined" color="primary" onClick={this.clickSubmit}>
          Update Post
        </Button>
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
          src={photoUrl}
          onError={e => (e.target.src = DefaultPost)}
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
