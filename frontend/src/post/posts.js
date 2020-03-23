import React, { Component } from "react";
import { list } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      expanded: false
    };
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
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
      <div className="row m-0">
        {posts.map((post, i) => {
          // const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          // const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          // const imgPath = post.photo ? post.photo.path : DefaultPost;
          return (
            <div className="card " key={i} style={{ width: "18rem" }}>
              <img
                className="card-img-top"
                src={`${process.env.REACT_APP_API_URL}/${
                  post.photo ? post.photo.path : DefaultPost
                }`}
                onError={i => (i.target.src = `${DefaultPost}`)}
                alt={post.name}
              />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 20)}</p>
                <Link to={`/post/${post._id}`} className="btn btn-primary">
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
      <div className="container-fluid p-0">
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
