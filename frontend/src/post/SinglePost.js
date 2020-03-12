import React, { Component } from "react";
import { singlePost } from "./apiPost";
import { Link } from "react-router-dom";

import DefaultPost from "../images/post.jpg";

class SinglePost extends Component {
  state = {
    post: ""
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
          <Link to={`/`} className="btn btn-raised btn-primary btn-sm">
            Back TO Posts
          </Link>
        </div>
      </div>
    );
  };
  render() {
    const { post } = this.state;
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
