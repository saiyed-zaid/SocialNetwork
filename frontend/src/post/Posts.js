import React, { Component } from "react";
import { list } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }
  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data.posts });
      }
    });
  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} posts  Posts To Be renderd On page
   */
  renderPosts = posts => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";

          return (
            <div className="card col-md-0 custom-card-load" key={i}>
              <img
                className="img-thumbnail"
                src={`${process.env.REACT_APP_API_URL}/${
                  post.photo ? post.photo.path : DefaultPost
                }`}
                onError={i => (i.target.src = `${DefaultPost}`)}
                alt={post.name}
              />
              <div className="card-body">
                <h6 className="card-title">{post.title}</h6>
                <p className="card-text">{post.body.substring(0, 10)}...</p>

                <p className="font-italic mark">
                  Posted By <Link to={`${posterId}`}>{posterName}</Link> on{" "}
                  {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-outline-primary custom-Read-more"
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    const { posts } = this.state;
    return (
      <div className="container-fluid">
        {!posts.length ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          this.renderPosts(posts)
        )}
      </div>
    );
  }
}

export default Posts;
