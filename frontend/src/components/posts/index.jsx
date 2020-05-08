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
        className=" col-md-6 card-body m-2  bg-light  post-card"
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
              <Link to={posterId}>{posterName}</Link> &nbsp;
              {this.props.post.tags.length > 1 ? (
                <small
                  data-toggle="tooltip"
                  data-placement="bottom"
                  data-html="true"
                  title={this.props.post.tags.map((tag) => tag.name + "<br />")}
                >
                  With {this.props.post.tags.length} More
                </small>
              ) : null}
            </span>
            <span className="description">{this.props.post.title}</span>
            <span className="description pb-3">
              Shared Publicly &nbsp;&nbsp;
              <TimeAgo date={this.props.post.created} />
            </span>
          </div>
          <div className="post-media">
            {this.props.post.photo.length > 1 ? (
              <div
                id="carouselExampleControls"
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
                  {this.props.post.photo.map((photo) => (
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
                  href="#carouselExampleControls"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Previous</span>
                </a>
                <a
                  className="carousel-control-next"
                  href="#carouselExampleControls"
                  role="button"
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon "
                    aria-hidden="true"
                  />
                  <span className="sr-only">Next</span>
                </a>
              </div>
            ) : null}
            {/*   {this.props.post.photo ? (
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
            ) : null} */}
          </div>
          <div>
            <p className="pt-2 text-dark text-center">
              {this.props.post.body.substring(0, 200) + "........."}
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
