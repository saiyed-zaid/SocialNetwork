import React, { Component } from "react";
import moment from "moment";
import Modal from "../components/modal/modal";

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
      const data = await this.props.fetchScheduledPosts(userId, token);

      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ posts: data.posts });
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
      const data = await this.props.deleteScheduledPost(postId, token);
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({});
        // setTimeout(this.toastPopupEnable, 8000);
        document.getElementById("deletepost").style.display = "none";
        document.getElementById("deletepost").classList.remove("show");
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { posts } = this.state;
    return (
      <>
        <div class="jumbotron-fluid m-4">
          <h1 class="display-5 text-light">Scheduled Posts</h1>
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
                        <button className="btn btn-info">Edit</button>
                        <button
                          className="btn btn-info"
                          onClick={() => this.handleDeleteModal(post._id)}
                        >
                          <i className="fas fa-trash text-danger"></i>
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
