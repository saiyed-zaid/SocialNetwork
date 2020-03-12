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
            <div className="card col-md-3 mr-5 mb-2 p-0" key={i}>
              <img
                className="img-thumbnail"
                src={`${process.env.REACT_APP_API_URL}/${
                  post.photo ? post.photo.path : DefaultPost
                }`}
                onError={i => (i.target.src = `${DefaultPost}`)}
                alt={post.name}
              />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 10)}...</p>

                <p className="font-italic mark">
                  Posted By <Link to={`${posterId}`}>{posterName}</Link> on{" "}
                  {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-raised btn-primary btn-sm"
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
      <div className="container">
        <h2 className="mb-5 mt-4">Recent Posts</h2>
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
