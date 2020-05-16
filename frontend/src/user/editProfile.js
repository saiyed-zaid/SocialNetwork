import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import Alert from "../ui-components/Alert";
import moment from "moment";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      gender: "",
      dob: "",
      email: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: "",
      photo: "",
      errors: {},
    };
    this.postData = new FormData();
  }

  init = async (userId) => {
    const token = isAuthenticated().user.token;

    const response = await this.props.read(userId, token);

    if (response.error) {
      this.setState({ redirectToProfile: true });
    } else {
      this.setState({
        id: response._id,
        name: response.name,
        gender: response.gender,
        dob: response.dob,
        email: response.email,
        error: "",
        about: response.about,
        photo: response.photo ? response.photo.path : DefaultProfile,
      });
    }
  };

  componentDidMount() {
    const userId = !this.props.authUser
      ? this.props.match.params.userId
      : this.props.authUser._id;
    this.init(userId);
  }

  handleInputChange = (event) => {
    //this.setState({ error: "" });
    //alert(event.target.value);

    var value;

    if (event.target.name === "photo") {
      var fileSizes = [];

      for (const file of event.target.files) {
        fileSizes.push(file.size);
      }

      for (const key of Object.keys(event.target.files)) {
        this.postData.append("photo", event.target.files[key]);
      }

      this.setState({
        [event.target.name]: event.target.files,
        fileSizes,
      });
    } else {
      value = event.target.value;

      this.postData.set(event.target.name, value);

      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    //this.setState({ loading: true });
    this.setState({ errors: {} });

    const userId = this.props.match.params.userId;

    const token = isAuthenticated().user.token;
    try {
      const response = await this.props.update(userId, token, this.postData);

      if (response.errors) {
        const formattedErrors = {};

        response.errors.forEach((error) => {
          formattedErrors[error.param] = error.msg;
        });

        this.setState({
          errors: formattedErrors,
        });
      } else if (isAuthenticated().user.role === "admin") {
        this.setState({
          redirectToProfile: true,
        });
      } else {
        await this.props.updateUser(response, () => {
          this.setState({
            redirectToProfile: true,
          });
        });
      }
    } catch (errors) {
      //alert("asd");
      console.log(errors);
      this.setState({
        errors,
      });
    }
  };

  render() {
    const {
      id,
      name,
      gender,
      dob,
      email,
      redirectToProfile,
      error,
      about,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <div className="container  bg-light p-2 my-3 col-md-6">
        <div className="jumbotron" style={{ padding: "0.5rem 2rem" }}>
          <h2>Edit Profile</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="photo"> Profile Photo</label>
              <div className="custom-file">
                <input
                  accept="image/*"
                  className="custom-file-input"
                  type="file"
                  onChange={this.handleInputChange}
                  name="photo"
                  id="photo"
                  aria-describedby="inputGroupFileAddon04"
                />
                <label className="custom-file-label" htmlFor="photo">
                  Choose Post Photo
                </label>
              </div>
            </div>

            <div className="form-group ">
              <label> Name</label>
              <input
                name="name"
                type="text"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["name"] && "is-invalid"
                }`}
                id="name"
                value={name}
                placeholder="Name"
              />
              {this.state.errors["name"] && (
                <div className="invalid-feedback">
                  {this.state.errors["name"]}
                </div>
              )}
            </div>

            <div className="form-group ">
              <label htmlFor="email"> Email</label>

              <input
                onChange={this.handleInputChange}
                type="email"
                className={`form-control ${
                  this.state.errors["email"] && "is-invalid"
                }`}
                value={email}
                name="email"
                placeholder="Email"
                id="email"
              />
              {this.state.errors["email"] && (
                <div className="invalid-feedback">
                  {this.state.errors["email"]}
                </div>
              )}
            </div>

            <div className="form-group ">
              <label> Date Of Birth</label>

              <input
                type="date"
                name="dob"
                className="form-control"
                onChange={this.handleInputChange}
                value={moment(dob).format("YYYY-MM-DD")}
              />
            </div>

            <div className="form-group ">
              <label> About</label>

              <textarea
                style={{ resize: "none" }}
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["about"] && "is-invalid"
                }`}
                value={about}
                name="about"
                placeholder="About"
                id="about"
              />
            </div>
            <div className="form-group ">
              <label> Gender : &nbsp;</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="inlineRadio1"
                    value="male"
                    onChange={this.handleInputChange}
                    checked={gender === "male"}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="inlineRadio2"
                    value="female"
                    onChange={this.handleInputChange}
                    checked={gender === "female"}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <button className="btn btn-primary" type="submit">
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
        <Alert
          message={error}
          type="danger"
          style={{ display: error ? "" : "none" }}
        />
      </div>
    );
  }
}

export default EditProfile;
