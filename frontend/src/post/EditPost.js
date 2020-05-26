import React from "react";

import { Multiselect } from "multiselect-react-dropdown";
import DefaultPost from "../images/post.jpg";

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      body: "",
      photo: "",
      fileSizes: [],
      errors: {},
      options: [],
      selectedTags: [],
    };
    this.postData = new FormData();
    this.multiselectRef = React.createRef();
    this.selectedopt = [];
  }

  async componentDidMount() {
    const userId = this.props.authUser._id;
    const token = this.props.authUser.token;

    const postId = !this.props.postId
      ? this.props.match.params.postId
      : this.props.postId;

    try {
      const data = await this.props.fetchPost(postId);
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
          photo: data.photo ? data.photo : DefaultPost,
          user: this.props.authUser,
          options: data.following,
          selectedTags: data.tags,
        });
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const data = await this.props.read(userId, token);
      if (data.err) {
        this.setState({ options: [] });
      } else {
        this.setState({ options: data.following });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleInputChange = (event) => {
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

      this.postData.append(event.target.name, value);

      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("tags", this.selectedopt);

    const userId = this.props.authUser._id;
    const token = this.props.authUser.token;

    if (this.selectedopt.length > 0) {
      this.postData.append("tags", JSON.stringify(this.selectedopt));
    }

    try {
      this.setState({ errors: {} });

      await this.props.editPost(this.postData, this.state.id, token);
      this.props.history.push(`/user/${userId}`);
    } catch (errors) {
      this.setState({
        errors,
      });
    }
  };

  onSelect = (selectedList, selectedItem) => {
    this.selectedopt.push({ id: selectedItem._id });
  };

  onRemove = (selectedList, removedItem) => {
    var removeIndex = this.selectedopt
      .map((item) => {
        return item.id;
      })
      .indexOf(removedItem._id);
    this.selectedopt.splice(removeIndex);
  };

  render() {
    return (
      <div className="container">
        {console.log(this.state.options)}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group text-light">
            <label htmlFor="photo">Photo</label>
            <input
              type="file"
              onChange={this.handleInputChange}
              name="photo"
              id="photo"
              className="form-control-file"
              multiple={true}
            />
          </div>
          <div className="form-group text-light">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              onChange={this.handleInputChange}
              name="title"
              id="title"
              className={`form-control ${
                this.state.errors["title"] && "is-invalid"
              }`}
              value={this.state.title}
              placeholder="Title"
            />

            {this.state.errors["title"] && (
              <div className="invalid-feedback">
                {this.state.errors["title"]}
              </div>
            )}
          </div>
          <div className="form-group text-light">
            <label htmlFor="body">Body</label>
            <textarea
              className={`form-control ${
                this.state.errors["body"] && "is-invalid"
              }`}
              onChange={this.handleInputChange}
              name="body"
              id="body"
              value={this.state.body}
              rows={3}
              placeholder="Enter Body"
            />

            {this.state.errors["body"] && (
              <div className="invalid-feedback">
                {this.state.errors["body"]}
              </div>
            )}
          </div>
          <div className="form-group">
            <Multiselect
              id="tags"
              className="form-control"
              ref={this.multiselectRef}
              options={this.state.options}
              onSelect={this.onSelect}
              onRemove={this.onRemove} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
              placeholder="Select Peoples To Tag"
              emptyRecordMsg="No People Found"
              selectedValues={this.state.selectedTags}
            />
          </div>
          <button className="btn btn-primary">Edit</button>
        </form>
      </div>
    );
  }
}

export default EditPost;
