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
      <div className="row">
        {posts.map((post, i) => {
          //const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          // const imgPath = post.photo ? post.photo.path : DefaultPost;
          return (
            <>
              {/* <Card
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
              </Card> */}
              <div
                className="card-body m-2"
                style={{ backgroundColor: "white" }}
              >
                {/* Post */}
                <div className="post">
                  <div className="user-block">
                    <img
                      className="img-circle img-bordered-sm"
                      src={
                        post.postedBy.path
                          ? post.postedBy.photo.path
                          : DefaultPost
                      }
                      alt="user image"
                    />
                    <span className="username">
                      <a href="#">{posterName}</a>
                      {/*  <a href="#" className="float-right btn-tool">
                    <i className="fas fa-times" />
                  </a> */}
                    </span>
                    <span className="description pb-3">
                      Shared Publicly -{new Date(post.created).toDateString()}
                    </span>
                  </div>
                  {/* /.user-block */}
                  {post.photo && post.photo.mimetype === "video/mp4" ? (
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
                  )}

                  <p className="pt-2 text-dark">{post.body}</p>
                  <p>
                    <a href="#" className="link-black text-sm mr-2">
                      <i className="fas fa-share mr-1" /> Share
                    </a>
                    <a href="#" className="link-black text-sm">
                      <i className="far fa-thumbs-up mr-1" /> Like
                    </a>
                    <span className="float-right">
                      <a href="#" className="link-black text-sm">
                        <i className="far fa-comments mr-1" /> Comments (5)
                      </a>
                    </span>
                  </p>
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Type a comment"
                  />
                </div>
              </div>
            </>
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
