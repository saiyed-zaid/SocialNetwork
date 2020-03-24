import React, { Component } from "react";
import { list } from "../user/apiUser";
import { isAuthenticated } from "../auth/index";
import { remove } from "../user/apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      checked: false,
      checkBox: []
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
    const { users, checkBox } = this.state;

    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">
          <h4>Users</h4>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" width="1%">
                No
              </th>
              <th scope="col">Profile Photo</th>
              <th scope="col">Name</th>
              <th scope="col">About</th>
              <th scope="col">Role</th>
              <th scope="col">Email</th>
              <th scope="col">Joined Date</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              return (
                <tr key={user._id} id={user._id}>
                  <th scope="row">{i + 1}</th>
                  <td width="5%">
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
                  </td>
                  <td width="15%">{user.name}</td>
                  <td width="20%">{user.about}</td>
                  <td width="10%">{user.role}</td>
                  <td width="15%">
                    <a href={`mailto:${user.email}`}> {user.email}</a>
                  </td>
                  <td>{new Date(user.created).toDateString()}</td>
                  <td width="1%">
                    <Link className="btn btn-sm" to={`/user/edit/${user._id}`}>
                      <i className="fa fa-edit"></i>
                    </Link>
                  </td>
                  <td width="1%">
                    <button
                      className="btn btn-sm"
                      onClick={() => this.deleteConfirmed(user._id)}
                      disabled={isAuthenticated().user._id === user._id}
                    >
                      <i className="fa fa-trash"> </i>
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

export default Users;
