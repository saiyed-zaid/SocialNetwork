import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import CommentList from "../components/commentList/index";
import Alert from "../ui-components/Alert";

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
        if (response.error) {
          console.log(response.error);
        } else {
          this.setState({ text: "" });
          this.props.updateComments(response.comments);
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
      if (response.error) {
        console.log(response.error);
      } else {
        this.props.updateComments(response.comments);
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
      <div className="ml-0">
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
                key={i}
                deleteClick={() => this.deleteConfirmed(comment)}
              />
            );
            /*  const photoUrl = comment.postedBy.photo
              ? comment.postedBy.photo.path
              : DefaultProfile;
            return (
              <div key={i} className="p-0 mt-0" style={{ color: "white" }}>
                <div className="comment-block">
                  <Link to={`/user/${comment.postedBy._id}`}>
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid black",
                      }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      src={`${process.env.REACT_APP_API_URL}/${photoUrl}`}
                      alt={comment.postedBy.name}
                      onError={(e) => {
                        e.target.src = DefaultProfile;
                      }}
                    />
                  </Link>
                  <div>
                    <h6 className="lead">
                      {comment.text}
                      &nbsp;
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.postedBy._id && (
                          <button
                            style={{
                              justifyContent: "flex-end",
                              border: "1px solid red",
                            }}
                            onClick={() => this.deleteConfirmed(comment)}
                            className="btn text-danger float-right btn-delete"
                          >
                            <i
                              className="fas fa-trash"
                              style={{ color: "none" }}
                            ></i>
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
                          <span
                            className=" font-italic"
                            style={{ fontSize: "12px" }}
                          >
                            Comment By : {"  "}
                            {comment.postedBy.name} {"  "}
                            <Timeago date={comment.created} />
                          </span>
                        </small>
                      </div>
                    </h6>
                  </div>
                </div>
              </div>
            ); */
          })}
          <form>
            <div className="form-group" style={{ flex: 2 }}>
              <input
                type="text"
                className="form-control"
                onChange={this.handleChange}
                value={this.state.text}
                placeholder="Leave A Comment"
              />
            </div>
            <button
              onClick={this.addComment}
              className="btn btn-raised btn-primary"
              style={{ flex: 1 }}
            >
              Add Comment <i className="fas fa-plus"></i>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Comment;
