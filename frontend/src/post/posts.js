import React, { Component } from "react";
import { list } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import Card from "../components/card";
import PageLoader from "../components/pageLoader";

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
    list().then((data) => {
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
  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          //const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          // const imgPath = post.photo ? post.photo.path : DefaultPost;
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
            /*    <div className="d-flex justify-content-center w-100">
                <div className="col-md-4 "></div>
                <div className="col-md-4  post-box p-0 rounded">
                  <div style={{ backgroundColor: "rgb(32, 32, 32);" }}>
                    <p className="text-dark">Mahesh</p>
                  </div>
                  <img
                    className="w-100"
                    src={`${process.env.REACT_APP_API_URL}/${
                      post.photo ? post.photo.path : DefaultPost
                    }`}
                    onError={(i) => (i.target.src = `${DefaultPost}`)}
                    alt={post.name}
                  />

                  {posterName}
                  {post.title}
                  {post.body.substring(0, 50) + "..."}
                  <div>
                    <label
                      className="brd-grdnt rounded"
                      style={{ padding: "1px" }}
                    >
                      <Link
                        to={`/post/${post._id}`}
                        className="btn btn-primary"
                      >
                        Read More
                      </Link>
                    </label>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
            */
          );
        })}
      </div>
    );
  };
  render() {
    const { posts } = this.state;

    return (
      <div className="container-fluid p-0 m-0">
        {!posts.length ? <PageLoader /> : this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
