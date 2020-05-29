import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import CommentList from "../components/commentList/index";
import Alert from "../ui-components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  isValid = () => {
    const { text } = this.state;

    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Comment Should Not Be Empty Or Greater Than 150 Characters",
      });
      return false;
    }
    return true;
  };
  handleChange = (event) => {
    this.setState({ error: "" });
    this.setState({ text: event.target.value });
  };

  addComment = async (event) => {
    event.preventDefault();
    if (!isAuthenticated()) {
      this.setState({ error: "Please Login To Leave The Comment" });
      return false;
    }
    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().user.token;
      const postId = this.props.postId;

      try {
        const response = await this.props.addComment(userId, token, postId, {
          text: this.state.text,
        });
        if (response.status === 200) {
          this.setState({ text: "" });
          this.props.updateComments(response.data.comments);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  deleteComment = async (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;
    const postId = this.props.postId;

    try {
      const response = await this.props.removeComment(
        userId,
        token,
        postId,
        comment
      );
      if (response.status === 200) {
        this.props.updateComments(response.data.comments);
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Function For Confirming The Comment Deletion
   */
  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are Youe Sure. You Want To Delete your Comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;
    return (
      <div className="ml-0 pb-3">
        <Alert
          style={{ display: error ? "" : "none" }}
          message={error}
          type="danger"
        />

        <hr />
        <div className="col-md-12">
          <h5 className="text-light">
            {comments.length === 1
              ? `${comments.length} Comment`
              : `${comments.length} Comments`}
          </h5>
          <hr />

          {comments.map((comment, i) => {
            return (
              <CommentList
                data={comment}
                i={i}
                key={i}
                deleteClick={() => this.deleteConfirmed(comment)}
                postId={this.props.postId}
                replyComment={this.props.replyComment}
                updateComments={this.props.updateComments}
              />
            );
          })}
          <form>
            <div className="form-group" style={{ flex: 2 }}>
              <input
                type="text"
                className="form-control text-light"
                onChange={this.handleChange}
                value={this.state.text}
                placeholder="Leave A Comment"
                style={{
                  backgroundColor: "#023340",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                }}
              />
            </div>
            <button
              onClick={this.addComment}
              className="btn btn-raised btn-primary"
              style={{ flex: 1 }}
            >
              Add Comment <FontAwesomeIcon icon={faPlus} />
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Comment;
