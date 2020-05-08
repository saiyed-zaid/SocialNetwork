import React, { Component } from "react";
import { list } from "./apiPost";
import PageLoader from "../components/pageLoader";
import PostCard from "../components/posts/index";
import LoadingRing from "../l1.gif";
import InfiniteLoader from "react-infinite-loader";

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
    try {
      setTimeout(() => {
        list().then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            this.setState({ posts: data.posts, isLoading: false });
          }
        });
      }, 500);
    } catch (error) {
      this.setState({ error: error });
    }
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

    /* if (posts.length < 0 || this.state.isLoading ) {
      return this.state.isLoading && <img src={LoadingRing} />;
    } */
    return (
      <div className="d-flex w-100 flex-column">{this.renderPosts(posts)}</div>
    );
  }
}

export default Posts;
