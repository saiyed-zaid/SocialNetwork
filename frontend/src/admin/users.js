import React, { Component } from "react";
import { list } from "../user/apiUser";
import { isAuthenticated } from "../auth/index";
import { remove, update, updateUser } from "../user/apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      status: false,
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

  onToggleSwitch = (event, user) => {
    const userId = user._id;
    const token = isAuthenticated().user.token;

    user.status = !user.status;
    console.log(user);
    update(userId, token, user).then(data => {
      if (data.msg) {
        this.setState({ error: data.msg });
      } else {
        updateUser(data, () => {
          console.log(data);

          this.setState({
            redirectToProfile: false
          });
        });
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
    const { users, checkBox, status } = this.state;

    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">
          <h4>Users</h4>
        </div>
        <table class="table table-hover" style={{ textAlign: "center" }}>
          <thead style={{ color: "#fff" }}>
            <tr>
              <th scope="col" width="1%">
                No
              </th>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">Email</th>
              <th scope="col">Joined Date</th>
              <th scope="col">Status</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody style={{ color: "#fff" }}>
            {users.map((user, i) => {
              return (
                <tr key={user._id} id={user._id}>
                  <th scope="row" width="1%">
                    {i + 1}
                  </th>
                  <td width="10%">{user.name}</td>
                  <td width="5%%">{user.role}</td>
                  <td width="10%">
                    <a style={{ color: "#fff" }} href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                  </td>

                  <td width="5%">{new Date(user.created).toDateString()}</td>
                  <td width="1%">
                    <div class="custom-control custom-switch">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="customSwitch1"
                        name={user._id}
                        onChange={e => this.onToggleSwitch(e, user)}
                        checked={user.status}
                      />
                      <label
                        class="custom-control-label"
                        for="customSwitch1"
                      ></label>
                    </div>
                  </td>
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
