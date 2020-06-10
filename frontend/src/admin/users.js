import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import "../../node_modules/react-toggle-switch/dist/css/switch.min.css";
import Avatar from "../components/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/modal/modal";
import Spinner from "../ui-components/Spinner";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      checked: false,
      checkBox: [],
      isProfileViewed: false,
      recordIndex: undefined,
      toastPopup: false,
      toastType: "",
      toastMsg: "",
      deleteId: "",
      search: "",
      editId: "",
      isLoading: true,
    };
    this.index = undefined;
  }

  async componentDidMount() {
    try {
      const response = await this.props.getAll(isAuthenticated().user.token);
      if (response.data.error) {
        console.log(response.error);
      } else {
        this.setState({ users: response.data.users, isLoading: false }, () => {
          const script = document.createElement("script");
          script.src = "/js/dataTables.js";
          document.body.appendChild(script);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  deleteAccount = async (userId) => {
    const token = isAuthenticated().user.token;

    if (isAuthenticated().user.role === "admin") {
      try {
        const response = await this.props.remove(userId, token);

        if (response.isDeleted) {
          this.setState({ redirect: true });
          document.getElementById("deleteprofile").style.display = "none";
          document.getElementById("deleteprofile").classList.remove("show");
        } else {
          console.log(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  editProfile = (userId) => {
    this.setState({ editId: userId });
  };

  /**
   * Function For Confirming The Account Deletion
   */
  deleteConfirmed = (userId) => {
    if (userId) {
      this.deleteAccount(userId);
      let getRow = document.getElementById(userId);
      getRow.addEventListener("animationend", () => {
        getRow.parentNode.removeChild(getRow);
        getRow.classList.remove("row-remove");
      });
      getRow.classList.toggle("row-remove");
    } else {
      alert("Please Select Record First");
    }
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

  handleDeleteModal = (userId) => {
    document.getElementById("deleteprofile").style.display = "block";
    document.getElementById("deleteprofile").classList.add("show");
    this.setState({ deleteId: userId });
  };

  hanldeMultipleDeleteModal = () => {
    document.getElementById("deleteprofile").style.display = "block";
    document.getElementById("deleteprofile").classList.add("show");
  };

  deleteMultiple = async () => {
    const { checkBox } = this.state;
    const token = isAuthenticated().user.token;

    if (checkBox.length === 0) {
      alert("Please Select Records To Delete.");
    } else {
      checkBox.forEach(async (id) => {
        const response = await this.props.remove(id, token);
        try {
          if (response.isDeleted) {
            this.setState({ redirect: true });
            let getRow = document.getElementById(id);
            getRow.addEventListener("animationend", () => {
              getRow.parentNode.removeChild(getRow);
              getRow.classList.remove("row-remove");
            });
            getRow.classList.toggle("row-remove");
          } else {
            console.log(response.data.msg);
          }
        } catch (error) {}
      });
      document.getElementById("deleteprofile").style.display = "none";
      document.getElementById("deleteprofile").classList.remove("show");
    }
  };

  updateSearch = (event) => {
    this.setState({ search: event.target.value.substr(0, 20) });
  };

  handleUserStatusChange = async (event) => {
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

    const response = await this.props.update(
      userId,
      isAuthenticated().user.token,
      data
    );
    try {
      if (response.data.err) {
        console.log("Error=> ", response.err);
      } else {
        this.setState({
          users: dataToUpdate,
          toastPopup: true,
          toastType: "success",
          toastMsg: "Record updated successfully.",
        });
        setTimeout(this.toastPopupEnable, 8000);
      }
    } catch (error) {
      console.log("ERR IN UPDATING", error);
    }
  };
  toastPopupEnable = () => {
    this.setState({ toastPopup: false });
  };

  render() {
    const { users } = this.state;
    // return 0;
    if (users.length < 0 || this.state.isLoading) {
      return this.state.isLoading && <Spinner />;
    }

    return (
      <div className="container-fluid m-0 p-0">
        <div className="jumbotron p-3 m-0">Total Users: {users.length}</div>
        <div className="d-flex m-1">
          <button
            className="btn btn-danger m-2 "
            onClick={this.hanldeMultipleDeleteModal}
            data-toggle="modal"
            // data-target="#exampleModalCenter"
          >
            <FontAwesomeIcon icon={faTrash} /> Delete Selected
          </button>
        </div>

        {users.length > 0 ? (
          <table className="table table-hover" id="userstable">
            <thead className="thead-dark">
              <tr>
                <th>
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
                <th scope="col">Name</th>
                <th scope="col">About</th>
                <th scope="col">Role</th>
                <th scope="col">Email</th>
                <th scope="col">Joined Date</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ width: "10px" }}>
                  Edit
                </th>
                <th scope="col" style={{ width: "10px" }}>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark text-light">
              {users.map((user, i) => {
                return (
                  <tr
                    key={user._id}
                    id={user._id}
                    style={{ cursor: "pointer" }}
                    data-index={i}
                    className="table-row"
                  >
                    <th>
                      <input
                        name="childchk"
                        type="checkbox"
                        id={user._id}
                        onChange={(e) => this.handleSingleCheckBox(e)}
                      />
                    </th>
                    <th scope="row">{i + 1}</th>
                    <td width="5%">
                      <Avatar
                        src={user.photo ? user.photo.photoURI : DefaultProfile}
                      />
                    </td>
                    <td width="15%">{user.name}</td>
                    <td width="20%">{user.about}</td>
                    <td width="10%">{user.role}</td>
                    <td width="15%">
                      <a
                        // style={{ color: "#fff" }}
                        href={`mailto:${user.email}`}
                      >
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
                      <Link
                        className="btn btn-sm"
                        to={`/user/edit/${user._id}`}
                        style={{ boxShadow: "unset" }}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-primary"
                        />
                      </Link>
                    </td>
                    <td width="1%">
                      <button
                        className="btn btn-sm"
                        style={{ boxShadow: "none" }}
                        disabled={isAuthenticated().user._id === user._id}
                        onClick={() => this.handleDeleteModal(user._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className=" text-danger"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}

        <Modal
          id="deleteprofile"
          title="Delete Record"
          body="Are Your Sure You Want To Delete ?"
          buttonText="Delete"
          show
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

export default Users;
