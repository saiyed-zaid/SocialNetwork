import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import PageLoader from "../components/pageLoader";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      gender: "",
      dob: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: "",
      photo: "",
    };
  }

  init = (userId) => {
    const token = isAuthenticated().user.token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          gender: data.gender,
          dob: data.dob,
          email: data.email,
          error: "",
          about: data.about,
          photo: data.photo ? data.photo.path : DefaultProfile,
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId =
      this.props.userId == null
        ? this.props.match.params.userId
        : this.props.userId;
    this.init(userId);
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value });
  };

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 1000000000) {
      this.setState({ error: "Photo Must Be Smaller then 100kb" });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name Is Required", loading: false });
      return false;
    }
    if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
      this.setState({ error: "A Valid Email Is Required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "password Must be 6 character Long",
        loading: false,
      });
      return false;
    }
    return true;
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId =
        this.props.userId === null
          ? this.props.match.params.userId
          : this.props.userId;
      const token = isAuthenticated().user.token;

      update(userId, token, this.userData).then((data) => {
        console.log("data", data, userId);

        if (data.msg) {
          this.setState({ error: data.msg });
        } else if (isAuthenticated().user.role === "admin") {
          this.setState({
            redirectToProfile: true,
          });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  editForm = (name, gender, dob, email, password, about) => {
    let getDate = new Date(dob);
    let dobDate =
      getDate.getFullYear() +
      "-" +
      getDate.getMonth("mm") +
      "-" +
      getDate.getDate("dd");
    console.log(dobDate);

    return (
      <form method="post">
        <div className="form-row text-dark">
          <div className="form-group col-md-6">
            <small>
              <label for="inputGroupFile04"> Profile Photo</label>
            </small>
            <div className="custom-file">
              <input
                accept="image/*"
                className="custom-file-input"
                type="file"
                onChange={this.handleChange("photo")}
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
              />
              <label className="custom-file-label" htmlFor="inputGroupFile04">
                Choose Post Photo
              </label>
            </div>
          </div>
          <div className="form-group col-md-6 ">
            <small>
              <label> Name</label>
            </small>

            <input
              onChange={this.handleChange("name")}
              type="text"
              className="form-control"
              value={name}
              name="name"
              placeholder="Name"
            />
          </div>
        </div>
        <div className="form-row text-dark">
          <div className="form-group col-md-6">
            <small>
              <label for="email"> Email</label>
            </small>

            <input
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
              name="email"
              placeholder="Email"
              id="email"
            />
          </div>

          <div className="form-group col-md-6">
            <small>
              {" "}
              <label>Password</label>
            </small>

            <input
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
              name="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="form-row text-dark">
          <div className="form-group col-md-6">
            <small>
              {" "}
              <label> About</label>
            </small>

            <textarea
              onChange={this.handleChange("about")}
              className="form-control"
              value={about}
              name="about"
              placeholder="About "
            />
          </div>
          <div className="form-group col-md-6">
            <small>
              {" "}
              <label> Date Of Birth</label>
            </small>

            <input
              type="date"
              name="dob"
              className="form-control"
              onChange={this.handleChange("dob")}
            />
          </div>

          <div className="form-group col-md-6 ">
            <div className="input-group">
              <small>
                <label> Gender : &nbsp;</label>
              </small>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={this.handleChange("gender")}
                checked={gender === "male"}
              />
              &nbsp;&nbsp;
              <label> Male</label>
              &nbsp;
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={this.handleChange("gender")}
                checked={gender === "female"}
              />
              &nbsp;&nbsp;
              <label> Female</label>
              &nbsp;
            </div>
          </div>
        </div>
        <div className="form-group col-md-12 text-center">
          <button className="btn btn-primary" onClick={this.clickSubmit}>
            Update Profile
          </button>
        </div>
      </form>
    );
  };

  render() {
    const {
      id,
      name,
      gender,
      dob,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about,
      photo,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }
    const photoUrl = id
      ? `${process.env.REACT_APP_API_URL}/${photo}`
      : DefaultProfile;

    return (
      <div>
        {/*   <div className="jumbotron p-3">
          <h2>Edit Profile</h2>
        </div> */}
        <div
          className="alert alert-danger alert-dismissible fade show col-md-4"
          style={{ display: error ? "" : "none" }}
        >
          {error}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          className="container-fluid p-0"
          /*  style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }} */
        >
          {loading ? <PageLoader /> : ""}

          {/*   <img
            style={{ height: "200px", width: "200px" }}
            className="img-thumbnail"
            src={photoUrl}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={name}
          />
 */}
          {this.editForm(name, gender, dob, email, password, about)}
        </div>
      </div>
    );
  }
}

export default EditProfile;
