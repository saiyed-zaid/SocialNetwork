import React, { Component } from "react";
import DefaultProfile from "../../images/avatar.jpg";
import Timeago from "react-timeago";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../auth/index";

export default class commentList extends Component {
  render() {
    const photoUrl = this.props.data.postedBy.photo
      ? this.props.data.postedBy.photo
      : DefaultProfile;
    return (
      <div key={this.props.key} className="text-light">
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
            <h6 className="lead m-0 p-0">
              {this.props.data.text}
              &nbsp;
              {isAuthenticated().user &&
                isAuthenticated().user._id === this.props.data.postedBy._id && (
                  <button
                    
                    onClick={() => this.props.deleteClick(this.props.data)}
                    className="btn btn-outline-primary float-right"
                  >
                    <i className="fas fa-trash"></i>
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
      </div>
    );
  }
}
