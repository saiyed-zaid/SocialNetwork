import React, { Component, useEffect, useState } from "react";
import { list } from "../user/apiUser";
import { isAuthenticated } from "../auth/index";
import { remove } from "../user/apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
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
  Button,
  Slide
} from "@material-ui/core";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      checked: false,
      checkBox: [],
      page: 0,
      rowsPerPage: 10
    };
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data.users });
      }
    });
  }

  deleteAccount = userId => {
    const token = isAuthenticated().user.token;

    if (isAuthenticated().user.role === "admin") {
      remove(userId, token).then(data => {
        if (data.isDeleted) {
          this.setState({ redirect: true });
        } else {
          console.log(data.msg);
        }
      });
    }
  };

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = userId => {
    let answer = window.confirm(
      "Are Youe Sure. You Want To Delete your Acccount?"
    );
    if (answer) {
      this.deleteAccount(userId);
      let getRow = document.getElementById(userId);
      getRow.addEventListener("animationend", () => {
        getRow.parentNode.removeChild(getRow);
        getRow.classList.remove("row-remove");
      });
      getRow.classList.toggle("row-remove");
    }
  };

  handleCheckBoxChange = event => {
    let selectAllCheckbox = document.getElementsByName("selectall")[0];
    let Checkboxes = document.querySelectorAll(".childchk");
    let arr = [];

    if (selectAllCheckbox.checked) {
      Checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        arr.push(checkbox.id);
      });
    } else {
      Checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        arr.push(checkbox.id);
      });
    }
    this.setState({ checkBox: arr });
  };

  handleSingleCheckBox = event => {
    const { checkbox } = this.state;

    let selectAllCheckbox = document.getElementsByName("selectall")[0];
    let Checkboxes = document.querySelectorAll(".childchk");
    let arr = this.state.checkBox;

    Checkboxes.forEach(checkBox => {
      let index = arr.indexOf(event.target.id);
      if (!event.target.checked) {
        if (index > -1) {
          arr.splice(index, 1);
        }
      } else {
        selectAllCheckbox.checked = false;
        arr.push(event.target.id);
      }
    });
  };
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: +event.target.value, page: 0 });
  };
  render() {
    const { users, checkBox, page, rowsPerPage } = this.state;

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
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">No</TableCell>
                  <TableCell align="center">Profile Photo</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">About</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Joined Date</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, i) => {
                    return (
                      <TableRow hover key={user._id} id={user._id} size="small">
                        <TableCell width="1%">{i + 1}</TableCell>
                        <TableCell width="5%" align="center">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${
                              user.photo ? user.photo.path : DefaultProfile
                            }`}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.name}
                            style={{
                              height: "40px",
                              width: "40px",
                              boxShadow: "2px 1px 5px black",
                              borderRadius: "50%"
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">{user.name}</TableCell>
                        <TableCell align="center">{user.about}</TableCell>
                        <TableCell align="center">{user.role}</TableCell>
                        <TableCell width="5%" align="center">
                          <a href={`mailto:${user.email}`}> {user.email}</a>
                        </TableCell>
                        <TableCell align="center">
                          {new Date(user.created).toDateString()}
                        </TableCell>
                        <TableCell width="1%" align="center">
                          <Link to={`/user/edit/${user._id}`}>
                            <Edit className="icon-edit" />
                          </Link>
                        </TableCell>
                        <TableCell width="1%" align="center">
                          <Button
                            onClick={() => this.deleteConfirmed(user._id)}
                            disabled={isAuthenticated().user._id === user._id}
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

export default Users;
