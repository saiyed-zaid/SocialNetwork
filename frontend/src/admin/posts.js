import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { list, remove,update } from "../post/apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import Avatar from "../components/Avatar";
import "../../node_modules/react-toggle-switch/dist/css/switch.min.css";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data.posts });
      }
    });
  }

  deletePost = postId => {
    const token = isAuthenticated().user.token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = postId => {
    let answer = window.confirm(
      "Are Youe Sure. You Want To Delete your Acccount?"
    );
    if (answer) {
      this.deletePost(postId);
      let getRow = document.getElementById(postId);
      getRow.addEventListener("animationend", () => {
        getRow.parentNode.removeChild(getRow);
        getRow.classList.remove("row-remove");
      });
      getRow.classList.toggle("row-remove");
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: +event.target.value, page: 0 });
  };

  handlePostStatusChange = event => {
    const index = event.target.getAttribute("data-index");
    const postId = this.state.posts[index]._id;
    if (!postId) {
      return false;
    }

    var dataToUpdate = this.state.posts;

    if (dataToUpdate[index].status) {
      dataToUpdate[index].status = false;
    } else {
      dataToUpdate[index].status = true;
    }

    const data = new FormData();
    data.append("status", dataToUpdate[index].status);

    update(postId, isAuthenticated().user.token, data)
      .then(result => {
        if (result.err) {
          console.log("Error=> ", result.err);
        } else {
          this.setState({ posts: dataToUpdate });
          console.log("RECORD UPDATED", result);
        }
      })
      .catch(err => {
        if (err) {
          console.log("ERR IN UPDATING", err);
        }
      });
  };

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} posts  Posts To Be renderd On page
   */
  renderPosts = posts => {
    return posts.map((post, i) => {
      const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
      const posterName = post.postedBy ? post.postedBy.name : "Unknown";
      return (
        <tr key={post._id} id={post._id}>
          <td>
            <input type="checkbox" name="selectall" id="selectall" />
          </td>
          <td>{i + 1}</td>

          <td>
            <img
              src={`${process.env.REACT_APP_API_URL}/${
                post.photo ? post.photo.path : DefaultPost
              }`}
              onError={i => (i.target.src = `${DefaultPost}`)}
              alt={post.name}
              style={{ height: "40px", width: "auto" }}
            />
          </td>
          <td> {post.likes.length}</td>
          <td>{post.comments.length}</td>
          <td>{post.title}</td>
          <td>{post.body.substring(0, 100)}</td>
          <td>
            <Link to={`${posterId}`}>{posterName}</Link> on{" "}
            {new Date(post.created).toDateString()}
          </td>
          <td>
            <Link
              className="btn btn-info text-info"
              to={`post/edit/${post._id}`}
            >
              <i className="fa fa-edit"></i>
            </Link>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => this.deleteConfirmed(post._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  };
  render() {
    const { posts } = this.state;
    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">
          <h4>Posts</h4>
        </div>
        <table class="table table-hover" style={{ color: "#fff" }}>
          <thead>
            <tr>
              <th scope="col" style={{widht:'10px'}}>No</th>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Likes</th>
              <th scope="col">Comments</th>
              <th scope="col">Posted</th>
              <th scope="col">Status</th>
              <th scope="col" style={{width:'10px'}}>Edit</th>
              <th scope="col" style={{width:'10px'}}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => {
              return (
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td>
                    <Avatar
                      src={`${process.env.REACT_APP_API_URL}/${
                        post.photo ? post.photo.path : DefaultPost
                      }`}
                    />
                  </td>
                  <td>{post.title}</td>
                  <td>{post.body.substring(0, 10)}...</td>
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
                    <Link className="btn btn-sm" style={{boxShadow:'unset'}} to={`/post/edit/${post._id}`}>
                      <i className="fa fa-edit"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => this.deleteConfirmed(post._id)}
                      style={{boxShadow:'unset'}}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Posts;
