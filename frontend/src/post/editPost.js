import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import PageLoader from "../components/pageLoader";

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
      prevPhoto: "",
    };
  }
  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
          photo: data.photo ? data.photo.path : DefaultPost,
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId =
      this.props.postId == null
        ? this.props.match.params.postId
        : this.props.postId;
    this.init(postId);
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    if (name === "photo") {
      this.setState({ prevPhoto: event.target.files[0] });
    }
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

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().user.token;

      update(postId, token, this.postData).then((data) => {
        if (data.msg) {
          this.setState({ error: data.msg });
        } else {
          this.setState({
            title: "",
            body: "",
            redirectToProfile: true,
            loading: false,
          });
        }
      });
    }
  };

  editPostForm = (title, body) => {
    return (
      <div className="col-md-6">
        <form method="post">
          <div class="input-group form-group">
            <div class="custom-file">
              <input
                accept="image/*,video/*"
                className="custom-file-input"
                type="file"
                onChange={this.handleChange("photo")}
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
              />
              <label class="custom-file-label" for="inputGroupFile04">
                Choose Post Photo
              </label>
            </div>
          </div>

          <div className="form-group">
            <input
              onChange={this.handleChange("title")}
              type="text"
              className="form-control"
              value={title}
              name="title"
            />
          </div>

          <div className="form-group">
            <textarea
              onChange={this.handleChange("body")}
              className="form-control"
              value={body}
              name="body"
            />
          </div>

          <button className="btn btn-primary" onClick={this.clickSubmit}>
            Update Post
          </button>
        </form>
      </div>
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
      photo,
    } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }
    const photoUrl = id
      ? `${process.env.REACT_APP_API_URL}/${photo}`
      : DefaultPost;
    return (
      <div>
        <div className="jumbotron p-3">
          <h2>EditPost</h2>
        </div>
        <div className="container d-flex align-items-center">
          <div className="col-md-6">
            <h2>{title}</h2>
            {this.state.prevPhoto.type === "video/mp4" ? (
              <div className="embed-responsive embed-responsive-4by3">
                <video controls className="embed-responsive-item">
                  <source
                    src={
                      !this.state.prevPhoto
                        ? photoUrl
                        : URL.createObjectURL(this.state.prevPhoto)
                    }
                    type="video/mp4"
                    alt="No Video Found"
                    // onError={e=>e.target.alt="No Video"}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <img
                style={{ height: "300px", width: "300px" }}
                className="img-thumbnail"
                src={
                  !this.state.prevPhoto
                    ? photoUrl
                    : URL.createObjectURL(this.state.prevPhoto)
                }
                onError={(i) => (i.target.src = `${DefaultPost}`)}
                alt={title}
              />
            )}
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
            {loading ? <PageLoader /> : ""}
          </div>
          {this.editPostForm(title, body)}
        </div>
      </div>
    );
  }
}

export default EditPost;
