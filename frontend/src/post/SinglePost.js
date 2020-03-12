import React, { Component } from "react";
import { singlePost, remove } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import DefaultPost from "../images/post.jpg";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false
  };
  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ post: data });
      }
    });
  }

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().user.token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are Youe Sure. You Want To Delete your Acccount?"
    );
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";
    return (
      <div className="card col-md-3 mr-5 mb-2 p-0">
        <img
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/${
            post.photo ? post.photo.path : DefaultPost
          }`}
          alt={post.name}
          style={{ height: "300px", width: "auto", objectFit: "cover" }}
        />
        <div className="card-body">
          <p className="card-text">{post.body}...</p>

          <p className="font-italic mark">
            Posted By <Link to={`${posterId}`}>{posterName}s</Link> on{" "}
            {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
              Back To Posts
            </Link>
            {isAuthenticated().user &&
              isAuthenticated().post.user._id === post.postedBy._id && (
                <>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5"
                  >
                    Update Post
                  </Link>
                  <button className="btn btn-raised btn-warning mr-5">
                    Delete Post
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { post, redirectToHome } = this.state;
    if (redirectToHome) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h2>{post.title}</h2>
        {!post ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          this.renderPost(post)
        )}
      </div>
    );
  }
}

export default SinglePost;
