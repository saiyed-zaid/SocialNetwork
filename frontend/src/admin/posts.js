import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { list, remove, update } from "../post/apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import Avatar from "../components/Avatar";
import Toast from "../components/Toast";
import "../../node_modules/react-toggle-switch/dist/css/switch.min.css";
import Modal from "../components/modal/modal";

class Posts extends Component {
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
    };
  }

  componentDidMount() {
    const token = isAuthenticated().user.token;
    list(true, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("ststst", data.posts);

        this.setState({ posts: data.posts });
      }
    });
  }

  deletePost = (postId) => {
    const token = isAuthenticated().user.token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          redirectToHome: true,
          toastPopup: true,
          toastType: "Success",
          toastMsg: "Record deleted successfully.",
        });
        setTimeout(this.toastPopupEnable, 8000);
        document.getElementById("deleteprofile").style.display = "none";
        document.getElementById("deleteprofile").classList.remove("show");
      }
    });
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

  deleteMultiple = () => {
    const { checkBox } = this.state;
    const token = isAuthenticated().user.token;

    if (checkBox.length === 0) {
      alert("Please Select Records To Delete.");
    } else {
      document.getElementById("deleteprofile").style.display = "block";
      document.getElementById("deleteprofile").classList.add("show");
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
      });
    }
  };

  handlePostStatusChange = (event) => {
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

    update(postId, isAuthenticated().user.token, data)
      .then((result) => {
        if (result.err) {
          console.log("Error=> ", result.err);
        } else {
          this.setState({
            posts: dataToUpdate,
            toastPopup: true,
            toastType: "success",
            toastMsg: "Record updated successfully.",
          });
          setTimeout(this.toastPopupEnable, 8000);
          console.log("RECORD UPDATED", result);
        }
      })
      .catch((err) => {
        if (err) {
          console.log("ERR IN UPDATING", err);
        }
      });
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

    document.getElementById("deleteprofile").style.display = "block";
    document.getElementById("deleteprofile").classList.add("show");
  };

  render() {
    const posts = this.state.posts.filter((post) => {
      return post.title.indexOf(this.state.search) !== -1;
    });
    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">
          <h4>Posts</h4>
          Total Posts: {posts.length}
        </div>
        {/* Toast */}
        <div className="d-flex">
          <button className="btn btn-danger m-2" onClick={this.deleteMultiple}>
            <i className="fas fa-trash"></i> Delete Selected
            {/*  */}
          </button>

          <div className="m-2 align-items-center"></div>
          <input
            type="text"
            value={this.state.search}
            onChange={this.updateSearch}
            style={{ border: "1px solid black" }}
            className="form-control col-md-2 ml-auto m-2 "
            placeholder="Search Here"
          />
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
        >
          <Toast
            status={
              this.state.toastPopup ? "toast fade show" : "toast fade hide"
            }
            type={
              this.state.toastPopup
                ? this.state.toastType
                : this.state.toastType
            }
            msg={
              this.state.toastPopup ? this.state.toastMsg : this.state.toastMsg
            }
          />
        </div>
        {/* Toast / */}
        <table class="table table-hover text-light">
          <thead>
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
              <th scope="col" style={{ width: "15px" }}>
                Image
              </th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Author</th>
              <th scope="col">Likes</th>
              <th scope="col">Comments</th>
              <th scope="col">Posted</th>
              <th scope="col">Status</th>
              <th scope="col" style={{ width: "10px" }}>
                Edit
              </th>
              <th scope="col" style={{ width: "10px" }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => {
              return (
                <tr id={post._id}>
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
                  <td>
                    <Avatar
                      src={`${process.env.REACT_APP_API_URL}/${
                        post.photo ? post.photo.path : DefaultPost
                      }`}
                    />
                  </td>
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
                  <td>{post.likes.length}</td>
                  <td> {post.comments.length}</td>
                  <td> {new Date(post.created).toDateString()}</td>
                  <td>
                    <div
                      className={post.status ? "switch on" : "switch off"}
                      onClick={this.handlePostStatusChange}
                      data-index={i}
                    >
                      <div
                        className="switch-toggle"
                        style={{ pointerEvents: "none" }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <Link
                      className="btn btn-sm"
                      style={{ boxShadow: "unset" }}
                      to={`/post/edit/${post._id}`}
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => this.handleDeleteModal(post._id)}
                      style={{ boxShadow: "unset" }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal
          id="deleteprofile"
          title="Delete Record"
          body="Are Your Sure You Want To Delete ?"
          buttonText="Delete"
          buttonClick={
            this.state.checkBox.length >= 1
              ? () => this.deleteMultiple()
              : () => this.deleteConfirmed(this.state.deleteId)
          }
        />
      </div>
    );
  }
}

export default Posts;
