import React, { Component } from "react";
import PostCard from "../components/posts/index";
import Spinner from "../ui-components/Spinner";
import Postservice from "../services/post";

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

  render() {
    const { posts } = this.state;

    if (posts.length <= 0 || this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <div className="row justify-content-md-center">
        {posts.map((post, i) => {
          return <PostCard post={post} index={i} />;
        })}
      </div>
    );
  }
}

export default Posts;
