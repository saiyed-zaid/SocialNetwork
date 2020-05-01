import React, { Component } from "react";
import { list } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import DefaultPost from "../images/post.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
import { isAuthenticated } from "../auth";
import PostCard from "../components/posts/index";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      expanded: false,
    };
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  componentDidMount() {
    list()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ posts: data.posts });
        }
      })
      .catch();
  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} posts  Posts To Be renderd On page
   */
  renderPosts = (posts) => {
    return (
      <div className="row justify-content-md-center  ">
        {posts.map((post, i) => {
          return <PostCard post={post} />;
        })}
      </div>
    );
  };
  render() {
    const { posts } = this.state;

    return (
      <div className="d-flex w-100 flex-column justify-content-center p-0 m-0">
        {!posts.length ? <PageLoader /> : this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
