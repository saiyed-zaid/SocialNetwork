import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";
import DefaultPost from "../../images/post.jpg";
import { isAuthenticated } from "../../auth/index";
import TimeAgo from "react-timeago";

export default class PostCard extends Component {
  render() {
    const posterId = this.props.post.postedBy
      ? `/user/${this.props.post.postedBy._id}`
      : "";
    const posterName = this.props.post.postedBy
      ? this.props.post.postedBy.name
      : "Unknown";

    return (
      <div
        className="col-md-6 card-body m-2 bg-light"
        style={{ position: "relative" }}
      >
        {/* this.props.post */}
        <div className="post">
          <div className="user-block">
            <img
              className="img-circle img-bordered-sm"
              src={
                this.props.post.postedBy.photo
                  ? this.props.post.postedBy.photo.path
                  : DefaultProfile
              }
              alt={posterName}
            />
            <span className="username">
              <Link to={posterId}>{posterName}</Link>
              {/*  <a href="#" className="float-right btn-tool">
                  <i className="fas fa-times" />
                </a> */}
            </span>
            <span className="description">{this.props.post.title}</span>
            <span className="description pb-3">
              Shared Publicly &nbsp;&nbsp;
              <TimeAgo date={this.props.post.created} />
              {/* {new Date(this.props.post.created).toDateString()} */}
            </span>
          </div>
          {this.props.post.photo ? (
            this.props.post.photo.mimetype === "video/mp4" ? (
              <div className="embed-responsive embed-responsive-16by9 p-0 m-0">
                <video controls className="embed-responsive-item p-0 m-0">
                  <source
                    src={`${process.env.REACT_APP_API_URL}/${
                      this.props.post.photo
                        ? this.props.post.photo.path
                        : DefaultPost
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
                  this.props.post.photo
                    ? this.props.post.photo.path
                    : DefaultPost
                }`}
                onError={(i) => (i.target.src = `${DefaultPost}`)}
                alt={this.props.post.name}
              />
            )
          ) : null}
          <div>
            <p className="pt-2 text-dark text-center">
              {this.props.post.body.substring(0, 200) + "........."}
            </p>
          </div>
          {isAuthenticated() ? (
            <>
              <div className="row justify-content-md-center">
                <button
                  className="btn "
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#0155ca",
                  }}
                >
                  <Link
                    className="text-light"
                    to={`/post/${this.props.post._id}`}
                  >
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
