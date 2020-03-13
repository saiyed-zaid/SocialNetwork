import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import DefaultPost from "../images/post.jpg";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0
  };
  componentDidMount() {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes)
        });
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

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().user.token;
    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";
    const { like, likes } = this.state;
    return (
      <div className=" container-fluid col-md-11 card mr-5 mb-2 mt-2 p-0 ">
        <img
          className="img-thumbnail p-0"
          src={`${process.env.REACT_APP_API_URL}/${
            post.photo ? post.photo.path : DefaultPost
          }`}
          alt={post.title}
          style={{ height: "400px", width: "100%" }}
        />

        <div className="card-body">
          {like ? (
            <h4 onClick={this.likeToggle}>
              <i class="fa fa-heart text-danger"></i> {likes}
              Likes
            </h4>
          ) : (
            <h4 onClick={this.likeToggle}>
              <i class="fa fa-heart-o"></i>
              {likes} Likes
            </h4>
          )}
          <h2>{post.title}</h2>
          <p className="card-text lead">{post.body}</p>

          <p className="font-italic mark">
            Posted By <Link to={`${posterId}`}>{posterName}</Link> on{" "}
            {new Date(post.created).toDateString()}
          </p>
          <div className="d-inline-block">
            <Link to="/" className="btn btn-raised btn-primary btn-sm mr-5">
              Back To Posts
            </Link>

            {isAuthenticated().user &&
              isAuthenticated().user._id === post.postedBy._id && (
                <>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5"
                  >
                    Update Post
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-warning mr-5"
                  >
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
    const { post, redirectToHome, redirectToSignin } = this.state;
    if (redirectToHome) {
      return <Redirect to="/" />;
    }
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <div>
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
