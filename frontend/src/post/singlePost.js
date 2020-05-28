import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import DefaultPost from "../images/post.jpg";
import Comment from "./comment";
import Spinner from "../ui-components/Spinner";
import Modal from "../components/modal/modal";
import EditPost from "./editPost";
import Carousel from "../ui-components/carosuel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

class SinglePost extends Component {
  state = {
    post: null,
    redirectToHome: false,
    redirectToSignin: false,
    isLoading: true,
    like: false,
    likes: 0,
    comments: [],
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    setTimeout(async () => {
      try {
        const response = await this.props.fetchPost(postId);

        if (response.error) {
          console.log(response.error);
        } else {
          this.setState({
            post: response,
            likes: response.likes.length,
            like: this.checkLike(response.likes),
            comments: response.comments,
            isLoading: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);
  }

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = async () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().user.token;

    let answer = window.confirm("Are Youe Sure. You Want To Delete your Post?");
    if (answer) {
      try {
        const response = await this.props.deletePost(postId, token);

        if (response.error) {
          return Promise.reject(response.error);
        } else {
          this.setState({ redirectToHome: true });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let arr = [];

    likes.forEach((e) => {
      arr.push(e.user);
    });

    var match = arr.indexOf(userId);

    if (match >= 0) {
      return true;
    }
    return false;
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = async (e) => {
    e.target.classList.add("icon-like");

    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? this.props.unlikePost : this.props.likePost;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().user.token;

    try {
      const response = await callApi(userId, token, postId);

      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: response.likes.length,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  getExt = (filepath) => {
    return filepath.split("?")[0].split("#")[0].split(".").pop();
  };
  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";
    const { like, likes } = this.state;
    return (
      <div>
        <div>
          {post.photo.length > 1 ? (
            <div style={{ height: "500px !important" }}>
              <div className="carosuel-height">
                <Carousel key={post._id} images={post.photo} />
              </div>
            </div>
          ) : this.getExt(post.photo[0]) === "mp4" ? (
            <video controls className="carosuel-height">
              <source src={post.photo[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className="img-thumbnail p-0 rounded-0"
              src={post.photo ? post.photo : DefaultPost}
              alt={post.title}
              style={{
                height: "400px",
                width: "100vw",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src = DefaultPost;
              }}
            />
          )}
        </div>

        <div className="card-body text-light">
          {like ? (
            <h5 onClick={this.likeToggle} className="text-light">
              <FontAwesomeIcon
                icon={faHeart}
                className=" text-danger"
                style={{ cursor: "pointer" }}
              />
              &nbsp; {likes}
              &nbsp; {likes > 1 ? "likes" : "like"}
            </h5>
          ) : (
            <h5 onClick={this.likeToggle} style={{ color: "#ffff" }}>
              <FontAwesomeIcon icon={faHeart} style={{ cursor: "pointer" }} />
              &nbsp;{likes}&nbsp;{likes > 1 ? "likes" : "like"}
            </h5>
          )}
          <div className="">
            <h4 className="lead pt-2 pb-2">
              <small>
                <span className="font-italic" style={{ fontSize: "12px" }}>
                  Posted By
                  <Link style={{ color: "#a59413" }} to={`${posterId}`}>
                    &nbsp;{posterName}&nbsp;
                  </Link>
                  on {new Date(post.created).toDateString()}
                </span>
              </small>
            </h4>
          </div>
          <h3>{post.title}</h3>
          <p className="card-text">{post.body}</p>

          <div className="d-inline-block">
            <Link to="/" className="btn btn-raised btn-primary mr-1">
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ cursor: "pointer" }}
              />
              Back
            </Link>

            {isAuthenticated().user &&
              isAuthenticated().user._id === post.postedBy._id && (
                <>
                  <button
                    className="btn btn-raised btn-primary mr-1 bg-dark"
                    data-toggle="modal"
                    onClick={this.handleEditPost}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ cursor: "pointer" }}
                    />
                  </button>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-primary mr-1 bg-dark"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer" }}
                    />
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    );
  };

  handleEditPost = () => {
    document.getElementById("editpost").style.display = "block";
    document.getElementById("editpost").classList.add("show");
  };
  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;
    if (post == null || this.state.isLoading) {
      return <Spinner />;
    }
    if (redirectToHome) {
      return <Redirect to="/" />;
    }
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className="container-fluid">
        {this.state.post ? this.renderPost(post) : {}}

        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
          addComment={this.props.addComment}
          removeComment={this.props.removeComment}
          replyComment={this.props.replyComment}
        />
        <Modal
          id="editpost"
          body={
            <EditPost
              {...this.props}
              postId={this.props.match.params.postId}
              authUser={this.props.authUser}
              editPost={this.props.editPost}
              read={this.props.read}
            />
          }
          title="Edit Post"
        />
      </div>
    );
  }
}

export default SinglePost;
