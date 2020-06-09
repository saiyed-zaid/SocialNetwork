import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { remove, update } from "../post/apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import Avatar from "../components/Avatar";
import Spinner from "../ui-components/Spinner";
import "../../node_modules/react-toggle-switch/dist/css/switch.min.css";
import Modal from "../components/modal/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

class ScheduledPosts extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      toastPopup: false,
      toastType: "",
      toastMsg: "",
      checkBox: [],
      deleteId: "",
      search: "",
      isLoading: true,
    };
  }

  async componentDidMount() {
    const token = isAuthenticated().user.token;

    try {
      const response = await this.props.fetchAllScheduledPosts(token);
      if (response.error) {
        console.log(response.data);
      } else {
        console.log("sche post", response.data);

        this.setState({ posts: response.data.posts, isLoading: false });
        const script = document.createElement("script");
        script.src = "/js/dataTables.js";
        document.body.appendChild(script);
      }
    } catch (error) {
      console.log(error);
    }
  }

  deletePost = async (postId) => {
    const token = isAuthenticated().user.token;
    try {
      const response = await this.props.deleteScheduledPost(postId, token);
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        this.setState({ redirectToHome: true });
        // setTimeout(this.toastPopupEnable, 8000);
        document.getElementById("deleteposts").style.display = "none";
        document.getElementById("deleteposts").classList.remove("show");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = (postId) => {
    this.deletePost(postId);
    let getRow = document.getElementById(postId);
    getRow.addEventListener("animationend", () => {
      getRow.parentNode.removeChild(getRow);
      getRow.classList.remove("row-remove");
    });
    getRow.classList.toggle("row-remove");
  };

  handleCheckBoxChange = (event) => {
    let selectAllCheckbox = document.getElementsByName("selectall")[0];
    let Checkboxes = document.getElementsByName("childchk");
    let arr = [];

    if (selectAllCheckbox.checked) {
      Checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
        arr.push(checkbox.id);
      });
    } else {
      Checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        arr = [];
      });
    }

    this.setState({ checkBox: arr });
  };

  handleSingleCheckBox = (event) => {
    let selectAllCheckbox = document.getElementsByName("selectall")[0];
    let Checkboxes = document.getElementsByName("childchk");

    let arr = [];

    Checkboxes.forEach((checkBox) => {
      let index = arr.indexOf(checkBox.id);

      if (!checkBox.checked) {
        if (index > -1) {
          arr.splice(index, 1);
        }
      } else {
        selectAllCheckbox.checked = false;
        arr.push(checkBox.id);
      }
    });
    this.setState({ checkBox: arr });
  };
  handleMulltipleDeleteModal = () => {
    document.getElementById("deleteposts").style.display = "block";
    document.getElementById("deleteposts").classList.add("show");
  };
  deleteMultiple = () => {
    const { checkBox } = this.state;
    const token = isAuthenticated().user.token;

    if (checkBox.length === 0) {
      alert("Please Select Records To Delete.");
    } else {
      checkBox.forEach((id) => {
        remove(id, token).then((data) => {
          if (data.isDeleted) {
            this.setState({ redirect: true });
            let getRow = document.getElementById(id);
            getRow.addEventListener("animationend", () => {
              getRow.parentNode.removeChild(getRow);
              getRow.classList.remove("row-remove");
            });
            getRow.classList.toggle("row-remove");
          } else {
            console.log(data.msg);
          }
        });
        document.getElementById("deleteposts").style.display = "none";
        document.getElementById("deleteposts").classList.remove("show");
      });
    }
  };

  handlePostStatusChange = async (event) => {
    const data = new FormData();

    const index = event.target.getAttribute("data-index");
    const postId = this.state.posts[index]._id;
    if (!postId) {
      return false;
    }

    var dataToUpdate = this.state.posts;

    if (dataToUpdate[index].status) {
      dataToUpdate[index].status = false;
      data.append("disabledBy", isAuthenticated().user._id);
    } else {
      dataToUpdate[index].status = true;
      data.append("disabledBy", "");
    }

    data.append("status", dataToUpdate[index].status);
    try {
      const result = await update(postId, isAuthenticated().user.token, data);
      if (result.err) {
        console.log("Error=> ", result.err);
      } else {
        this.setState({
          posts: dataToUpdate,
          toastPopup: true,
          toastType: "success",
          toastMsg: "Record updated successfully.",
        });
      }
    } catch (error) {
      console.log("ERR IN UPDATING", error);
    }
  };
  toastPopupEnable = () => {
    this.setState({ toastPopup: false });
  };

  handleModalValue = (postId) => {
    this.setState({ deleteId: postId });
  };
  updateSearch = (event) => {
    this.setState({ search: event.target.value.substr(0, 20) });
  };
  handleDeleteModal = (postId) => {
    this.setState({ deleteId: postId });

    document.getElementById("deleteposts").style.display = "block";
    document.getElementById("deleteposts").classList.add("show");
  };

  render() {
    const { posts } = this.state;
    if (posts.length < 0 || this.state.isLoading) {
      return this.state.isLoading && <Spinner />;
    }
    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">Total Posts: {posts.length}</div>

        {/* Toast */}
        <div className="d-flex">
          <button
            className="btn btn-danger m-2"
            onClick={this.handleMulltipleDeleteModal}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete Selected
            {/*  */}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            bottom: "0",
            right: "0",
            zIndex: "111",
          }}
        ></div>
        {/* Toast / */}
        <table id="scheduledpoststable" className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col" width="5%">
                <input
                  name="selectall"
                  type="checkbox"
                  onChange={(e) => this.handleCheckBoxChange(e)}
                />
              </th>
              <th scope="col" style={{ width: "10px" }}>
                No
              </th>

              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Author</th>
              <th scope="col">tags</th>
              <th scope="col">Posted On</th>
              <th scope="col" style={{ width: "10px" }}>
                Edit
              </th>
              <th scope="col" style={{ width: "10px" }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-light">
            {posts.map((post, i) => {
              return (
                <tr id={post._id} key={post._id} className="table-row">
                  {console.log(post)}
                  <th>
                    <input
                      name="childchk"
                      type="checkbox"
                      id={post._id}
                      onChange={(e) => this.handleSingleCheckBox(e)}
                      width="1%"
                    />
                  </th>
                  <th scope="row">{i + 1}</th>

                  <td>{post.title}</td>
                  <td
                    data-toggle="tooltip"
                    data-html="true"
                    data-placement="right"
                    title={post.body}
                  >
                    {post.body.substring(0, 10)}...
                  </td>
                  <td>{post.postedBy.name}</td>
                  <td>{post.tags.map((tag) => tag.name)}</td>
                  <td> {new Date(post.scheduleTime).toDateString()}</td>
                  <td>
                    <Link
                      className="btn btn-sm  "
                      style={{ boxShadow: "unset" }}
                      to={`/post/scheduledpost/edit/${post._id}`}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-primary" />
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => this.handleDeleteModal(post._id)}
                      style={{ boxShadow: "none" }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger"
                        color="green"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal
          id="deleteposts"
          title="Delete Record"
          body="Are Your Sure You Want To Delete ?"
          buttonText="Delete"
          buttonClick={
            this.state.checkBox.length >= 1
              ? () => this.deleteMultiple()
              : () => this.deleteConfirmed(this.state.deleteId)
          }
          show
        />
      </div>
    );
  }
}

export default ScheduledPosts;
