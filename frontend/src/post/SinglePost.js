import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import DefaultPost from "../images/post.jpg";
import Comment from "./Comment";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };
  componentDidMount() {
    const postId = this.props.match.params.postId;

    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.likes);

        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
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
    let arr = [];

    likes.forEach(e => {
      arr.push(e._id);
    });
    var match = arr.indexOf(userId);
    if (match >= 0) {
      return true;
    }
    return false;
  };

  updateComments = comments => {
    this.setState({ comments });
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
      <div>
        <div>
          <img
            className="img-thumbnail p-0"
            src={`${process.env.REACT_APP_API_URL}/${
              post.photo ? post.photo.path : DefaultPost
            }`}
            alt={post.title}
            style={{ height: "400px", width: "100vw", objectFit: "scale-down" }}
            onError={e => {
              e.target.src = DefaultPost;
            }}
          />
        </div>

        <div className="card-body">
          {like ? (
            <h5 onClick={this.likeToggle}>
              <i className="fa fa-heart text-danger"> </i>&nbsp; {likes}
              &nbsp; {likes > 1 ? "likes" : "like"}
            </h5>
          ) : (
            <h5 onClick={this.likeToggle}>
              <i className="fa fa-heart-o"> </i>
              &nbsp;{likes}&nbsp;{likes > 1 ? "likes" : "like"}
            </h5>
          )}
          <hr />
          {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
            <div class="card mt-5 w-100">
              <div className="card-body">
                <h5 className="card-title">Admin</h5>
                <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                <div>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-outline-secondary btn-custom"
                  >
                    Update Post &nbsp; <i className="fa fa-edit"></i>
                  </Link>{" "}
                  &nbsp;&nbsp;
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-outline-secondary btn-custom"
                  >
                    Delete Post &nbsp; <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <h3>{post.title}</h3>
            <h4 className="lead">
              <small>
                {" "}
                <span className=" font-italic" style={{ fontSize: "12px" }}>
                  Posted By <Link to={`${posterId}`}>{posterName}</Link> on{" "}
                  {new Date(post.created).toDateString()}
                </span>
              </small>
            </h4>
          </div>
          <p className="card-text">{post.body}</p>

          <div className="d-inline-block">
            <Link to="/" className="btn btn-raised btn-primary mr-1">
              <i className="fa fa-arrow-left"></i> Back
            </Link>

            {isAuthenticated().user &&
              isAuthenticated().user._id === post.postedBy._id && (
                <>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-info mr-1"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-danger mr-1"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;
    if (redirectToHome) {
      return <Redirect to="/" />;
    }
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className=" container-fluid col-md-11 mr-5 mb-2 mt-2 p-0 ">
        {!post ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;
