import React, { Component } from "react";
import { list } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";
import LoadingRing from "../l1.gif";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      expanded: false,
      isLoading: true,
    };
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  componentDidMount() {
    setTimeout(() => {
      list().then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ posts: data.posts, isLoading: false });
        }
      });
    }, 500);

  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} posts  Posts To Be renderd On page
   */
  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          return (
            <Card
              className="card like-box"
              key={i}
              style={{ width: "20rem" }}
              img={

                post.photo && post.photo.mimetype === "video/mp4" ? (
                  <div className="embed-responsive embed-responsive-1by1 p-0 m-0">
                    <video controls className="embed-responsive-item">
                      <source
                        src={`${process.env.REACT_APP_API_URL}/${
                          post.photo ? post.photo.path : DefaultPost
                        }`}
                        type="video/mp4"
                        alt="No Video Found"
                        // onError={e=>e.target.alt="No Video"}
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <img
                    className="card-img-top"
                    src={`${process.env.REACT_APP_API_URL}/${
                      post.photo ? post.photo.path : DefaultPost
                    }`}
                    onError={(i) => (i.target.src = `${DefaultPost}`)}
                    alt={post.name}
                  />
                )
              }
              postedBy={posterName}
              title={post.title}
              text={post.body.substring(0, 50) + "..."}
            >
              <label className="brd-grdnt rounded" style={{ padding: "1px" }}>
                <Link to={`/post/${post._id}`} className="btn btn-primary">
                  Read More
                </Link>
              </label>
            </Card>
          );
        })}
      </div>
    );
  };
  render() {
    const { posts } = this.state;
    if (posts.length < 0 || this.state.isLoading) {
      return this.state.isLoading && <img src={LoadingRing} />;
    }
    return (
      <div className="container-fluid p-0 m-0">{this.renderPosts(posts)}</div>
    );
  }
}

export default Posts;
