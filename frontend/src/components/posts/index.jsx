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
              onError={(event) => (event.target.src = DefaultProfile)}
            />
            <span className="username">
              <Link to={posterId}>{posterName}</Link> &nbsp;
              {this.props.post.tags.length > 1 ? (
                <small
                  data-toggle="tooltip"
                  data-placement="bottom"
                  data-html="true"
                  title={this.props.post.tags.map(
                    (tag) => tag.name + " <br />"
                  )}
                >
                  With {this.props.post.tags.length} More
                </small>
              ) : null}
            </span>

            <span className="description pb-3">
              Shared Publicly &nbsp;&nbsp;
              <TimeAgo date={this.props.post.created} />
            </span>
          </div>
          <div className="post-media">
            {this.props.post.photo.length >= 1 ? (
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
            )}
          </div>
          <div className="d-flex justify-content-start flex-row">
            <div className="mr-2">
              <svg
                className="bi bi-heart-fill"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{color:'red'}}
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                  clip-rule="evenodd"
                />
              </svg>
              <small>&nbsp;105</small>
            </div>
            <div>
              <svg
                className="bi bi-chat-quote"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                  clip-rule="evenodd"
                />
                <path d="M7.468 7.667c0 .92-.776 1.666-1.734 1.666S4 8.587 4 7.667C4 6.747 4.776 6 5.734 6s1.734.746 1.734 1.667z" />
                <path
                  fill-rule="evenodd"
                  d="M6.157 6.936a.438.438 0 01-.56.293.413.413 0 01-.274-.527c.08-.23.23-.44.477-.546a.891.891 0 01.698.014c.387.16.72.545.923.997.428.948.393 2.377-.942 3.706a.446.446 0 01-.612.01.405.405 0 01-.011-.59c1.093-1.087 1.058-2.158.77-2.794-.152-.336-.354-.514-.47-.563zm-.035-.012h-.001.001z"
                  clip-rule="evenodd"
                />
                <path d="M11.803 7.667c0 .92-.776 1.666-1.734 1.666-.957 0-1.734-.746-1.734-1.666 0-.92.777-1.667 1.734-1.667.958 0 1.734.746 1.734 1.667z" />
                <path
                  fill-rule="evenodd"
                  d="M10.492 6.936a.438.438 0 01-.56.293.413.413 0 01-.274-.527c.08-.23.23-.44.477-.546a.891.891 0 01.698.014c.387.16.72.545.924.997.428.948.392 2.377-.942 3.706a.446.446 0 01-.613.01.405.405 0 01-.011-.59c1.093-1.087 1.058-2.158.77-2.794-.152-.336-.354-.514-.469-.563zm-.034-.012h-.002.002z"
                  clip-rule="evenodd"
                />
              </svg>
              <small>&nbsp;5</small>
            </div>
          </div>
          <div className="text-center">
            <h5 className="description">{this.props.post.title}</h5>
            <p className="pt-2 text-dark">
              {this.props.post.body.substring(0, 500) + "..."}
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
