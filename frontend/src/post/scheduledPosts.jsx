import React, { Component } from "react";
import { Link } from "react-router-dom";

import moment from "moment";
import Modal from "../components/modal/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default class scheduledPosts extends Component {
  constructor() {
    super();
    this.state = {
      posts: "",
      deleteId: "",
    };
  }
  async componentDidMount() {
    const userId = this.props.authUser._id;
    const token = this.props.authUser.token;

    try {
      const response = await this.props.fetchScheduledPosts(userId, token);

      if (response.status === 200) {
        this.setState({ posts: response.data.posts });
      } else {
        this.setState({ error: response.data.error });
      }
    } catch (error) {
      console.log(error);
    }
  }
  handleDeleteModal = (postId) => {
    this.setState({ deleteId: postId });

    document.getElementById("deletepost").style.display = "block";
    document.getElementById("deletepost").classList.add("show");
  };

  deleteConfirmed = (postId) => {
    this.deletePost(postId);
    /*  let getRow = document.getElementById(postId);
    getRow.addEventListener("animationend", () => {
      getRow.parentNode.removeChild(getRow);
      getRow.classList.remove("row-remove");
    });
    getRow.classList.toggle("row-remove"); */
  };

  deletePost = async (postId) => {
    const token = this.props.authUser.token;
    try {
      const response = await this.props.deleteScheduledPost(postId, token);
      if (response.status === 200) {
        this.setState({});
        document.getElementById("deletepost").style.display = "none";
        document.getElementById("deletepost").classList.remove("show");
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { posts } = this.state;
    return (
      <>
        <div className="jumbotron-fluid m-4">
          <h1 className="display-5 text-light">Scheduled Posts</h1>
        </div>
        <div className="container-fluid">
          <div>
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Post Title</th>
                  <th scope="col">Scheduled Time</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody className="bg-light">
                {posts &&
                  posts.map((post, i) => (
                    <tr className="table-row">
                      <th scope="row">{i}</th>
                      <td>{post.title}</td>
                      <td>
                        {moment(post.scheduleTime).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td>
                        <Link to={`/post/scheduledpost/edit/${post._id}`}>
                          Edit
                        </Link>
                        &nbsp;&nbsp;&nbsp;{" "}
                        <button
                          className="btn"
                          onClick={() => this.handleDeleteModal(post._id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className=" text-danger"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Modal
            id="deletepost"
            title="Delete Scheduled Post"
            body="Are Your Sure You Want To Delete ?"
            buttonText="Delete"
            buttonClick={() => this.deleteConfirmed(this.state.deleteId)}
            show
          />
        </div>
      </>
    );
  }
}
