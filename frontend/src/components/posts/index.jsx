import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";
import DefaultPost from "../../images/post.jpg";
import { isAuthenticated } from "../../auth/index";
import TimeAgo from "react-timeago";

export default class PostCard extends Component {
  render() {
    const { post } = this.props;
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";

    return (
      <div
        className="col-md-6 card-body m-2 bg-light"
        style={{ position: "relative" }}
      >
        {/* post */}
        <div className="post">
          <div className="user-block">
            <img
              className="img-circle img-bordered-sm"
              src={
                post.postedBy.photo ? post.postedBy.photo.path : DefaultProfile
              }
              alt={posterName}
            />
            <span className="username">
              <Link to={posterId}>{posterName}</Link> &nbsp;
              {post.tags.length > 1 ? (
                <small
                  data-toggle="tooltip"
                  data-placement="bottom"
                  data-html="true"
                  title={post.tags.map((tag) => tag.name + " <br />")}
                >
                  With {post.tags.length} More
                </small>
              ) : null}
            </span>
            <span className="description">{post.title}</span>
            <span className="description pb-3">
              Shared Publicly &nbsp;&nbsp;
              <TimeAgo date={post.created} />
            </span>
          </div>
          <div className="post-media">
            {post.photo.length > 1 ? (
              <div
                id={post._id}
                className="carousel slide"
                data-ride="carousel"
              >
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      className="d-block w-100"
                      src="https://fakeimg.pl/350x200/?text=SwipeLeft&font=lobster"
                      alt="First slide"
                    />
                  </div>
                  {post.photo.map((photo) => (
                    <div className="carousel-item">
                      <img
                        className="d-block w-100"
                        src={photo}
                        alt="post "
                        onError={(i) => (i.target.src = `${DefaultPost}`)}
                      />
                    </div>
                  ))}
                </div>
                <a
                  className="carousel-control-prev"
                  href={post._id}
                  role="button"
                  data-slide="prev"
                  // data-target={`#${post._id}`}
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next"
                  href={post._id}
                  role="button"
                  data-slide="next"
                  // data-target={`#${post._id}`}
                >
                  <span
                    className="carousel-control-next-icon "
                    aria-hidden="true"
                  />
                  <span className="sr-only">Next</span>
                </a>
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
          </div>
          <div>
            <p className="pt-2 text-dark text-center">
              {post.body.substring(0, 200) + "...."}
            </p>
          </div>

          {isAuthenticated() ? (
            <>
              <div className="row justify-content-md-center">
                <button
                  className="btn"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#0155ca",
                  }}
                >
                  <Link className="text-light" to={`/post/${post._id}`}>
                    Read More
                  </Link>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  }
}
