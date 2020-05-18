import React, { Component } from "react";
import DefaultProfile from "../../images/avatar.jpg";
import Timeago from "react-timeago";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../auth/index";
import { commentReply } from "./api";
import { comment } from "../../post/apiPost";

export default class commentList extends Component {
  constructor() {
    super();
    this.state = {
      commentReply: "",
    };
  }

  handleReplyInput = (event) => {
    this.setState({ commentReply: event.target.value });
  };
  addCommentReply = async () => {
    let userId = this.props.data.postedBy._id;
    let token = isAuthenticated().user.token;
    let postId = this.props.postId;
    let commentId = this.props.data._id;
    try {
      await this.props.replyComment(
        userId,
        token,
        postId,
        this.state.commentReply,
        commentId
      );
    } catch (error) {
      
    }
  };
  showReplyBox = (e) => {
    const replybox = document.getElementById(this.props.i);

    if (replybox.style.display === "none") {
      replybox.style.display = "block";
    } else {
      replybox.style.display = "none";
    }

    // console.log(e);
  };
  render() {
    const photoUrl = this.props.data.postedBy.photo
      ? this.props.data.postedBy.photo
      : DefaultProfile;
    return (
      <div key={this.props.i} className="p-0 mt-0" style={{ color: "white" }}>
        <div className="comment-block">
          <Link to={`/user/${this.props.data.postedBy._id}`}>
            <img
              className="float-left mr-2 rounded"
              height="30px"
              src={photoUrl}
              alt={this.props.data.postedBy.name}
              onError={(e) => {
                e.target.src = DefaultProfile;
              }}
            />
          </Link>
          <div>
            <h6>
              {this.props.data.text}
              &nbsp;
              {isAuthenticated().user &&
              isAuthenticated().user._id === this.props.data.postedBy._id ? (
                <button
                  style={{
                    justifyContent: "flex-end",
                    border: "1px solid red",
                  }}
                  onClick={() => this.props.deleteClick(this.props.data)}
                  className="btn text-danger float-right btn-delete"
                >
                  <i className="fas fa-trash" style={{ color: "none" }}></i>
                </button>
              ) : (
                <button
                  className="btn-sm btn-secondary float-right"
                  style={{
                    justifyContent: "flex-end",
                  }}
                  onClick={(e) => this.showReplyBox(e)}
                >
                  <i class="fas fa-reply"></i>&nbsp; Reply
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
                    {this.props.data.postedBy.name} {"  "}
                    <Timeago date={this.props.data.created} />
                  </span>
                </small>
              </div>
            </h6>
          </div>
        </div>
        {this.props.data.replies.map((reply) => (
          <div className="comment-block ml-5">
            <Link to={`/user/${reply.postedBy._id}`}>
              <img
                style={{
                  borderRadius: "50%",
                  border: "1px solid black",
                }}
                className="float-left mr-2"
                height="20px"
                width="20px"
                src={reply.postedBy.photo}
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
                  isAuthenticated().user._id ===
                    this.props.data.postedBy._id && (
                    <i
                      className="fas fa-trash float-right"
                      onClick={() => this.props.deleteClick(this.props.data)}
                      style={{ color: "none", cursor: "pointer" }}
                    ></i>
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
        <div className="row" id={this.props.i} style={{ display: "none" }}>
          <input
            className="form-control-sm col-md-10 ml-4 "
            type="text"
            name="commentreply"
            id="commentreply"
            placeholder="Reply Comment"
            onChange={this.handleReplyInput}
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
