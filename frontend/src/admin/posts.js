import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { list, remove } from "../post/apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import { Edit, Delete } from "@material-ui/icons";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Container,
  Button
} from "@material-ui/core";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 0,
      rowsPerPage: 10
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
    const { posts, page, rowsPerPage } = this.state;
    console.log("ost gr", posts);

    return (
      <Container>
        <div className="jumbotron p-3">
          <h4>Users</h4>
        </div>
        <Paper>
          <TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={posts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No</TableCell>
                  <TableCell align="center">Photo</TableCell>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Likes</TableCell>
                  <TableCell align="center">Comments</TableCell>
                  <TableCell align="center">Posted Date</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((post, i) => {
                    return (
                      <TableRow hover key={post._id} id={post._id} size="small">
                        <TableCell width="1%">{i + 1}</TableCell>
                        <TableCell width="5%" align="center">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${
                              post.photo ? post.photo.path : DefaultPost
                            }`}
                            onError={i => (i.target.src = `${DefaultPost}`)}
                            alt={post.title}
                            style={{
                              height: "40px",
                              width: "40px",
                              boxShadow: "2px 1px 5px black",
                              borderRadius: "50%"
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">{post.title}</TableCell>
                        <TableCell align="center">
                          {post.body.substring(0, 10)}...
                        </TableCell>
                        <TableCell align="center">
                          {post.likes.length}
                        </TableCell>
                        <TableCell align="center">
                          {post.comments.length}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(post.created).toDateString()}
                        </TableCell>
                        <TableCell width="1%" align="center">
                          <Link to={`/post/edit/${post._id}`}>
                            <Edit className="icon-edit" />
                          </Link>
                        </TableCell>
                        <TableCell width="1%" align="center">
                          <Button
                            onClick={() => this.deleteConfirmed(post._id)}
                          >
                            <Delete className="icon-delete" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }
}

export default Posts;
