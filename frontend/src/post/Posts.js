import React, { Component } from "react";
import { list } from "./apiPost";
import PageLoader from "../components/pageLoader";
import PostCard from "../components/posts/index";
import Spinner from "../ui-components/Spinner";
import Postservice from "../Services/post";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      expanded: false,
      isLoading: true,
      error: "",
    };
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  componentDidMount() {
    var postService = new Postservice();

    setTimeout(async () => {
      try {
        const response = await postService.fetchPosts();

        if (response.error) {
          return Promise.reject(response.error);
        } else {
          this.setState({ posts: response.posts, isLoading: false });
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }, 500);
  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} posts  Posts To Be renderd On page
   */
  renderPosts = (posts) => {
    return (
      <div className="row justify-content-md-center">
        {posts.map((post, i) => {
          return <PostCard post={post} />;
        })}
      </div>
    );
  };
  render() {
    const { posts, error } = this.state;
    
    if (posts.length < 0 || this.state.isLoading) {
      return <Spinner />;
    }
    return this.renderPosts(posts);
  }
}

export default Posts;
