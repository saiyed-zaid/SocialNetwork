import React, { Component } from "react";
import { isAuthenticated } from "../auth/index";
import { create } from "./apiPost";
import { read } from "../user/apiUser";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import { Multiselect } from "multiselect-react-dropdown";
import PageLoader from "../components/pageLoader";
// import Toast from "../components/Toast";

class NewPost extends Component {
  constructor() {
    super();
    this.multiselectRef = React.createRef();
    this.state = {
      title: "",
      body: "",
      photo: "",
      tags: [],
      error: "",
      user: [],
      fileSize: 0,
      prevPhoto: "",
      loading: false,
      redirectToProfile: false,
      options: [],
      selectedValue: {},
    };
    this.postData = new FormData();
    this.selectedopt = [];
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().user.token;
    document.getElementById("tags").setAttribute("name", "tags");

    this.setState({ user: isAuthenticated().user });

    read(userId, token)
      .then((data) => {
        if (data.err) {
          this.setState({ options: [] });
        } else {
          this.setState({ options: data.following });
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    if (name === "photo") {
      this.setState({ prevPhoto: event.target.files[0] });
    }
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (title.length === 0) {
      this.setState({ error: "Title field is required", loading: false });
      return false;
    } else if (title.length < 5 || title.length > 120) {
      this.setState({
        error: "Title length must between 5 to 1200.",
        loading: false,
      });
    }
    if (body.length === 0) {
      this.setState({ error: "Body field is required", loading: false });
      return false;
    } else if (body.length < 5 || body.length > 2000) {
      this.setState({
        error: "Description length must between 5 to 2000.",
        loading: false,
      });
    }

    if (fileSize > 1000000000) {
      this.setState({ error: "Photo Must Be Smaller then 100kb" });
      return false;
    }
    return true;
  };

  onSelect = (selectedList, selectedItem) => {
    //console.log(selectedItem._id);

    this.selectedopt.push(selectedItem._id);
    //this.selectedopt["tags"] = selectedItem;
  };

  onRemove(selectedList, removedItem) {
    this.setState(
      { tags: selectedList },
      this.postData.set("tags", selectedList.name)
    );
  }

  clickSubmit = (event) => {
    event.preventDefault();

    this.postData.append("tags", JSON.stringify(this.selectedopt));

    //this.postData.append("tags", this.selectedopt);

    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().user.token;

      create(userId, token, this.postData).then((data) => {
        if (data.msg || data.err) {
          this.setState({ error: data.msg || data.err });
        } else {
          this.setState({ redirectToProfile: true });
        }
      });
    }
  };

  newPostForm = (title, body) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div className="test">
          <div className="form-group">
            <img
              src={
                this.state.prevPhoto
                  ? URL.createObjectURL(this.state.prevPhoto)
                  : DefaultPost
              }
              alt=""
              className="form-control"
              style={{
                height: "350px",
                maxWidth: "350px",
                padding: 0,
                border: "none",
              }}
            />
          </div>
        </div>
        <form method="post" className="col-md-6">
          <div
            className="alert alert-danger fade show"
            style={
              this.state.error ? { display: "block" } : { display: "none" }
            }
          >
            {this.state.error}
          </div>
          <div className="input-group form-group">
            <div className="custom-file">
              <input
                accept="image/*,video/*"
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
          <div className="form-group">
            <input
              onChange={this.handleChange("title")}
              className="form-control"
              type="text"
              value={title}
              name="title"
              placeholder="Post Title"
            />
          </div>

          <div className="form-group">
            <textarea
              onChange={this.handleChange("body")}
              className="form-control"
              value={body}
              name="body"
              placeholder="Post Description"
            />
          </div>

          <div className="form-group bg-light rounded">
            <Multiselect
              id="tags"
              className="form-control"
              ref={this.multiselectRef}
              options={this.state.options} // Options to display in the dropdown
              selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
              /* onSelect={(selectedList, selectedItem) => {
                this.onSelect(selectedList, selectedItem);
              }} */
              onSelect={this.onSelect}
              /* onSelect={   (selectedList, removedItem) =>
                this.onSelect(selectedList, removedItem)
              } // Function will trigger on select event */
              onRemove={(selectedList, removedItem) =>
                this.onRemove(selectedList, removedItem)
              } // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
              placeholder="Select Peoples To Tag"
              emptyRecordMsg="No People Found"
            />
          </div>

          <button className="btn btn-primary" onClick={this.clickSubmit}>
            Create Post
          </button>
        </form>
      </div>
    );
  };

  render() {
    const { title, body, user, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container-fluid p-0">
        <div className="jumbotron p-3">
          <h4>Create A New Post</h4>
        </div>

        {/* <Toast type="Alert" msg={error} status={(error)?"toast fade show":"toast fade hide"} /> */}
        {loading ? <PageLoader /> : null}

        <div className="p-0">{this.newPostForm(title, body)}</div>
      </div>
    );
  }
}

export default NewPost;
