import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { read, update } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { updateUser } from "./apiUser";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: "",
      image: ""
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /*   init = userId => {
    const token = isAuthenticated().user.token;

    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  }; */

  /*  componentDidMount() {
    this.userData = new FormData();

    const userId = this.props.match.params.userId;
    this.init(userId);
  } */
  /* 
  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  }; */

  /*   isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000) {
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
        loading: false
      });
      return false;
    }
    return true;
  }; */

  /* hANDLED bUTTON SUBMIT EVENT BEGIN */

  /* const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password: password || undefined,

    }; */
  // this.setState({ loading: true });

  /* this.userData.append("img", this.state.image); */

  onFileChange(e) {
    this.setState({ image: e.target.files[0] });
  }

  onNameChange(e) {
    this.setState({ name: e.target.value });
  }
  onEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  onPasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userId = this.props.match.params.userId;
    const token = isAuthenticated().user.token;

    const formData = new FormData();

    formData.append("name", this.state.name);
    formData.append("email", this.state.email);
    formData.append("password", this.state.password);
    formData.append("image", this.state.image);

    /*    axios.post("http://localhost:3001/api/user-profile", formData, {
    }).then(res => {
        console.log(res)
    }) */

    update(userId, token, formData).then(data => {
      for (const iterator of formData.values()) {
        /* console.log("DATA TO UPDATED__", iterator); */
      }
      if (data.msg) {
        this.setState({ error: data.msg });
      } else {
        updateUser(data, () => {
          this.setState({
            redirectToProfile: true
          });
        });
      }
    });
  }

  /* HANDLED bUTTON SUBMIT EVENT END */

  editForm = (name, email, password, about) => {
    return (
      <form
        method="post"
        onSubmit={this.onSubmit}
        encType="multipart/form-data"
      >
        {
          <div className="form-group">
            <label className="bmd-label-floating">Profile Photo</label>
            <input
              /* onChange={this.handleChange("img")} */
              type="file"
              className="form-control"
              name="img"
              onChange={this.onFileChange}
            />
          </div>
        }
        <div className="form-group">
          <label className="bmd-label-floating">Name</label>
          <input
            onChange={this.onNameChange}
            type="text"
            className="form-control"
            value={name}
            name="name"
          />
        </div>

        <div className="form-group">
          <label className="bmd-label-floating">Email</label>
          <input
            onChange={this.onEmailChange}
            type="email"
            className="form-control"
            value={email}
            name="email"
          />
        </div>
        {/*   <div className="form-group">
          <label className="bmd-label-floating">About</label>
          <textarea
            onChange={this.handleChange("about")}
            className="form-control"
            value={about}
            name="about"
          />
        </div> */}
        <div className="form-group">
          <label className="bmd-label-floating">Password</label>
          <input
            //onChange={this.handleChange("password")}
            onChange={this.onPasswordChange}
            type="password"
            className="form-control"
            value={password}
            name="password"
          />
        </div>
        <button
          //onClick={this.clickSubmit}
          type="submit"
          className="btn btn-raised btn-primary"
        >
          Update
        </button>
      </form>
    );
  };

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mb-5 mt-4">Edit Profile</h2>
        <div
          className="alert alert-danger alert-dismissible fade show"
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
        {loading ? <div></div> : ""}

        {/* <img
          style={{ height: "200px", width: "200px" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={name}
        /> */}

        {this.editForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;
