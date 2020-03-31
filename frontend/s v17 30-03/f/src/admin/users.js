import React, { Component } from "react";
import { list } from "../user/apiUser";
import { isAuthenticated } from "../auth/index";
import { remove, update } from "../user/apiUser";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Card from "../components/card";
import Switch from "react-toggle-switch";
import "../../node_modules/react-toggle-switch/dist/css/switch.min.css";
import Avatar from "../components/Avatar";
class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      checked: false,
      checkBox: [],
      isProfileViewed: false,
      recordIndex: undefined
    };
    this.index = undefined;
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
    /* let selectAllCheckbox = document.getElementsByName("selectall")[0];
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
    this.setState({ checkBox: arr }); */
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

  showCard = event => {
    /* const profileCard = document.querySelector(".card");
    profileCard.style.opacity = "0"; */
    this.setState({ isProfileViewed: false });
    /*  var table = document.querySelector("#usersTable");
    table.style.opacity = "1"; */
  };

  rowHandler = event => {
    console.log("evt", event.target.parentNode.nodeName);
    //nodeName: "TR"
    if (event.target.parentNode.nodeName === "TR") {
      this.index = event.target.parentNode.getAttribute("data-index");
      this.setState({ isProfileViewed: true });
    } else {
      alert("Something went wrong while fetching row");
    }
  };

  handleUserStatusChange = event => {
    const index = event.target.getAttribute("data-index");
    const userId = this.state.users[index]._id;
    if (!userId) {
      return false;
    }

    var dataToUpdate = this.state.users;

    if (dataToUpdate[index].status) {
      dataToUpdate[index].status = false;
    } else {
      dataToUpdate[index].status = true;
    }

    const data = new FormData();
    data.append("status", dataToUpdate[index].status);

    update(userId, isAuthenticated().user.token, data)
      .then(result => {
        if (result.err) {
          console.log("Error=> ", result.err);
        } else {
          this.setState({ users: dataToUpdate });
          console.log("RECORD UPDATED", result);
        }
      })
      .catch(err => {
        if (err) {
          console.log("ERR IN UPDATING", err);
        }
      });
  };

  render() {
    const { users, checkBox } = this.state;
    if (this.state.isProfileViewed) {
      return (
        <div style={{ postion: "relative" }}>
          <Card
            class="card"
            style={{
              width: "18rem",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              transition: "unset",
              animation: "unset"
            }}
            img={
              <img
                className="card-img-top "
                src={DefaultProfile}
                onError={i => (i.target.src = `${DefaultProfile}`)}
                alt="zaid"
              />
            }
            title={this.state.users[this.index].name}
            text={this.state.users[this.index].about}
          >
            <label className="brd-grdnt rounded" style={{ padding: "1px" }}>
              <Link to="1" className="btn btn-primary">
                Active
              </Link>
            </label>
            <span
              style={{
                position: "absolute",
                top: "0",
                right: "5px",
                cursor: "pointer",
                padding: "3px",
                color: "#ffff",
                borderRadius: "0 0 5px 5px",
                backgroundColor: "#1a1d24"
              }}
              onClick={this.showCard}
            >
              X
            </span>
          </Card>
        </div>
      );
    }
    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">
          <h4>Users</h4>
        </div>
        <table class="table table-hover text-light" id="usersTable">
          <thead>
            <tr>
              <th scope="col" style={{widht:'10px'}}>No</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">About</th>
              <th scope="col">Role</th>
              <th scope="col">Email</th>
              <th scope="col">Joined Date</th>
              <th scope="col">Status</th>
              <th scope="col" style={{width:'10px'}}>Edit</th>
              <th scope="col" style={{width:'10px'}}>Delete</th>
            </tr>
          </thead>
          <tbody style={{ color: "#fff" }}>
            {users.map((user, i) => {
              return (
                <tr
                  key={user._id}
                  id={user._id}
                  /* onClick={this.rowHandler} */
                  style={{ cursor: "pointer" }}
                  data-index={i}
                >
                  <th scope="row">{i + 1}</th>
                  <td width="5%">
                    <Avatar
                      src={`${process.env.REACT_APP_API_URL}/${
                        user.photo ? user.photo.path : DefaultProfile
                      }`}
                    />
                  </td>
                  <td width="15%">{user.name}</td>
                  <td width="20%">{user.about}</td>
                  <td width="10%">{user.role}</td>
                  <td width="15%">
                    <a style={{ color: "#fff" }} href={`mailto:${user.email}`}>
                      {" "}
                      {user.email}
                    </a>
                  </td>
                  <td>{new Date(user.created).toDateString()}</td>
                  <td>
                    <div
                      className={user.status ? "switch on" : "switch off"}
                      onClick={this.handleUserStatusChange}
                      data-index={i}
                    >
                      <div
                        className="switch-toggle"
                        style={{ pointerEvents: "none" }}
                      ></div>
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
