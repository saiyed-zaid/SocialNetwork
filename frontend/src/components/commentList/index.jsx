import React, { Component } from "react";
import DefaultProfile from "../../images/avatar.jpg";
import Timeago from "react-timeago";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../auth/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faReply } from "@fortawesome/free-solid-svg-icons";

export default class commentList extends Component {
  constructor() {
    super();
    this.state = {
      commentReply: "",
    };
  }
  componentWillReceiveProps() {
    this.setState({ commentReply: "" });
  }
  handleReplyInput = (event) => {
    this.setState({ commentReply: event.target.value });
  };
  addCommentReply = async () => {
    let userId = isAuthenticated().user._id;
    let token = isAuthenticated().user.token;
    let postId = this.props.postId;
    let commentId = this.props.data._id;
    try {
      const response = await this.props.replyComment(
        userId,
        token,
        postId,
        this.state.commentReply,
        commentId
      );
      if (response.error) {
        console.log(response.error);
      } else {
        this.setState({ commentReply: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  showReplyBox = (e) => {
    const replybox = document.getElementById(this.props.i);
    console.log(replybox);

    if (replybox.style.display === "none") {
      replybox.style.display = "flex";
      replybox.style.alignItems = "baseline";
      replybox.style.justifyContent = "space-between";
    } else {
      replybox.style.display = "none";
    }
  };
  render() {
    const { data } = this.props;
    // const photoUrl = data.postedBy.photo ? data.postedBy.photo : DefaultProfile;
    return (
      <div
        key={this.props.i + "asdsd"}
        className="p-0 mt-0"
        style={{ color: "white" }}
      >
        <div className="comment-block">
          <Link to={`/user/${data.postedBy._id}`}>
            <img
              className="float-left mr-2 rounded"
              height="30px"
              width="30px"
              src={
                data.postedBy.photo.photoURI
                  ? data.postedBy.photo.photoURI
                  : DefaultProfile
              }
              alt={data.postedBy.name}
              onError={(e) => {
                e.target.src = DefaultProfile;
              }}
            />
          </Link>
          <div>
            <h6>
              {data.text}
              &nbsp;
              {isAuthenticated().user &&
              isAuthenticated().user._id === data.postedBy._id ? (
                <button
                  style={{
                    justifyContent: "flex-end",
                    border: "1px solid red",
                  }}
                  onClick={() => this.props.deleteClick(data)}
                  className="btn text-danger float-right btn-delete"
                >
                  <FontAwesomeIcon icon={faTrash} style={{ color: "none" }} />
                </button>
              ) : (
                <button
                  className="btn-sm btn-secondary float-right"
                  style={{
                    justifyContent: "flex-end",
                  }}
                  onClick={(e) => this.showReplyBox(e)}
                >
                  <FontAwesomeIcon icon={faReply} />
                  &nbsp; Reply
                </button>
              )}
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <small>
                  <span className=" font-italic" style={{ fontSize: "12px" }}>
                    Comment By : {"  "}
                    {data.postedBy.name} {"  "}
                    <Timeago date={data.created} />
                  </span>
                </small>
              </div>
            </h6>
          </div>
        </div>
        {data.replies.map((reply, i) => (
          <div className="comment-block ml-5" key={i + "xqf"}>
            <Link to={`/user/${reply.postedBy._id}`}>
              <img
                style={{
                  // borderRadius: "50%",
                  border: "1px solid black",
                }}
                className="float-left mr-2"
                height="30px"
                width="30px"
                src={
                  reply.postedBy.photo
                    ? reply.postedBy.photo.photoURI
                    : DefaultProfile
                }
                alt={reply.postedBy.name}
                onError={(e) => {
                  e.target.src = DefaultProfile;
                }}
              />
            </Link>
            <div>
              <h6>
                {reply.text}
                &nbsp;
                {isAuthenticated().user &&
                  isAuthenticated().user._id === data.postedBy._id && (
                    <FontAwesomeIcon
                      className="float-right"
                      onClick={() => this.props.deleteClick(data)}
                      style={{ color: "none", cursor: "pointer" }}
                    />
                  )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <small>
                    <span className=" font-italic" style={{ fontSize: "12px" }}>
                      Replied By : {"  "}
                      {reply.postedBy.name} {"  "}
                      <Timeago date={reply.created} />
                    </span>
                  </small>
                </div>
              </h6>
            </div>
          </div>
        ))}
        <br />
        <div className="" id={this.props.i} style={{ display: "none" }}>
          <input
            className="form-control-sm my-2"
            type="text"
            name="commentreply"
            id="commentreply"
            placeholder="Reply Comment"
            onChange={this.handleReplyInput}
            style={{ flex: "1" }}
          />
          <button
            className="btn-sm btn-primary"
            type="submit"
            onClick={this.addCommentReply}
          >
            Reply
          </button>
        </div>
      </div>
    );
  }
}
