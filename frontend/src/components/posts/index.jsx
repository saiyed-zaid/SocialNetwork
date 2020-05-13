import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../../images/avatar.jpg";
import DefaultPost from "../../images/post.jpg";
import { isAuthenticated } from "../../auth/index";
import TimeAgo from "react-timeago";
import Carosuel from "../../ui-components/carosuel";

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
                {post.status ? (
                  <>
                    <i class="fas fa-lock"></i>&nbsp;&nbsp;
                    <small>Private</small>
                  </>
                ) : (
                  <>
                    <i class="fas fa-globe-asia"></i>&nbsp;&nbsp;
                    <small>Public</small>
                  </>
                )}
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
          <h4 className="description text-center">{post.title}</h4>

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
