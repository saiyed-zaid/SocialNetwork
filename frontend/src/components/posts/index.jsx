import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";
import DefaultPost from "../../images/post.jpg";
import { isAuthenticated } from "../../auth/index";
import TimeAgo from "react-timeago";
import Carosuel from "../../ui-components/carosuel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAsia, faLock } from "@fortawesome/free-solid-svg-icons";

export default class PostCard extends Component {
  getExt = (filepath) => {
    return filepath.split("?")[0].split("#")[0].split(".").pop();
  };
  render() {
    const { post } = this.props;
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";

    return (
      <div
        className="col-md-6 card-body m-2"
        style={{
          backgroundColor: "#1f2022",
          color: "#c0c8d0",
        }}
      >
        {/* post */}
        <div className="post">
          <div className="user-block">
            <img
              className="rounded-circle"
              src={
                post.postedBy.photo
                  ? post.postedBy.photo.photoURI
                  : DefaultProfile
              }
              alt={posterName}
              onError={(event) => (event.target.src = DefaultProfile)}
            />
            <span className="username text-left">
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

            {this.props.profile ? (
              <span className="description pb-3 text-left">
                <div className="btn-group ">
                  <a
                    // type="button"
                    href="/"
                    style={{ boxShadow: "none", cursor: "pointer" }}
                    // className="btn"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {post.status ? (
                      <>
                        <FontAwesomeIcon icon={faGlobeAsia} /> &nbsp;
                        <small>Public</small>&nbsp;
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faLock} /> &nbsp;
                        <small>Private</small>&nbsp;
                      </>
                    )}
                  </a>
                  <div className="dropdown">
                    <div className="dropdown-menu dropdown-menu-right bg-secondary">
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => this.props.handlePostStatusChange(post)}
                      >
                        {!post.status ? "Public" : " Private"}
                      </button>
                    </div>
                  </div>
                </div>
                &nbsp;&nbsp;
                <TimeAgo date={post.created} />
              </span>
            ) : (
              <span className="description pb-3">
                Shared Publicly &nbsp;&nbsp;
                <TimeAgo date={post.created} />
              </span>
            )}
          </div>
          <div className="post-media">
            {post.photo.length > 1 ? (
              <Carosuel images={post.photo} index={this.props.index} />
            ) : this.getExt(post.photo[0]) === "mp4" ? (
              <video className=" w-100" controls>
                <source
                  src={post.photo ? post.photo[0] : null}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                className="card-img-top"
                src={`${post.photo ? post.photo[0] : DefaultPost}`}
                onError={(i) => (i.target.src = `${DefaultPost}`)}
                alt={post.name}
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
                style={{ color: "red" }}
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                  clipRule="evenodd"
                />
              </svg>
              <small>&nbsp;{post.likes.length}</small>
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
                  fillRule="evenodd"
                  d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                  clipRule="evenodd"
                />
                <path d="M7.468 7.667c0 .92-.776 1.666-1.734 1.666S4 8.587 4 7.667C4 6.747 4.776 6 5.734 6s1.734.746 1.734 1.667z" />
                <path
                  fillRule="evenodd"
                  d="M6.157 6.936a.438.438 0 01-.56.293.413.413 0 01-.274-.527c.08-.23.23-.44.477-.546a.891.891 0 01.698.014c.387.16.72.545.923.997.428.948.393 2.377-.942 3.706a.446.446 0 01-.612.01.405.405 0 01-.011-.59c1.093-1.087 1.058-2.158.77-2.794-.152-.336-.354-.514-.47-.563zm-.035-.012h-.001.001z"
                  clipRule="evenodd"
                />
                <path d="M11.803 7.667c0 .92-.776 1.666-1.734 1.666-.957 0-1.734-.746-1.734-1.666 0-.92.777-1.667 1.734-1.667.958 0 1.734.746 1.734 1.667z" />
                <path
                  fillRule="evenodd"
                  d="M10.492 6.936a.438.438 0 01-.56.293.413.413 0 01-.274-.527c.08-.23.23-.44.477-.546a.891.891 0 01.698.014c.387.16.72.545.924.997.428.948.392 2.377-.942 3.706a.446.446 0 01-.613.01.405.405 0 01-.011-.59c1.093-1.087 1.058-2.158.77-2.794-.152-.336-.354-.514-.469-.563zm-.034-.012h-.002.002z"
                  clipRule="evenodd"
                />
              </svg>
              <small>&nbsp;{post.comments.length}</small>
            </div>
          </div>

          <h4 className="description text-center">{post.title}</h4>

          <div>
            <p className="pt-2 text-center">
              {post.body.substring(0, 200) + "...."}
            </p>

            {isAuthenticated() ? (
              <>
                <div className="row justify-content-center">
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
      </div>
    );
  }
}
