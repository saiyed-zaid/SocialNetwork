import React from "react";
import { validateAll } from "indicative/validator";
import { read } from "../user/apiUser";
import { create } from "./apiPost";
import { Multiselect } from "multiselect-react-dropdown";

class NewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      photo: "",
      tags: [],
      errors: {},
      user: [],
      fileSize: 0,
      prevPhoto: "",
      loading: false,
      redirectToProfile: false,
      options: [],
      selectedValue: {},
    };
    this.postData = new FormData();
    this.multiselectRef = React.createRef();
    this.selectedopt = [];
  }

  componentDidMount() {
    console.log(this.props);

    const userId = this.props.authUser._id;
    const token = this.props.authUser.token;

    this.setState({ user: this.props.authUser });

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

  handleInputChange = (event) => {
    var value;
    if (event.target.name === "photo") {
      value = event.target.files[0];
      const fileSize = event.target.files[0].size;

      this.setState({
        [event.target.name]: value,
        fileSize,
      });
    } else {
      value = event.target.value;
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
    this.postData.set(event.target.name, value);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const data = this.state;
    this.postData.append("tags", JSON.stringify(this.selectedopt));

    const rules = {
      title: "required|string|max:120|min:5",
      body: "required|string|max:2000",
    };

    const messages = {
      required: "{{field}} field is required",
    };

    validateAll(data, rules, messages)
      .then(() => {
        this.setState({ errors: {} });

        const userId = this.props.authUser._id;
        const token = this.props.authUser.token;

        create(userId, token, this.postData)
          .then((data) => {
            if (data.errors) {
              const formattedErrors = {};
              data.errors.forEach((error) => {
                if (!formattedErrors.hasOwnProperty(error.param)) {
                  formattedErrors[error.param] = error.msg;
                }
              });
              this.setState({ errors: formattedErrors });
            } else {
              this.props.history.push(`/user/${userId}`);
            }
          })
          .catch((errors) => {
            console.log(errors);
          });
      })
      .catch((errors) => {
        var formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.field] = error.message;
        });

        this.setState({
          errors: formattedErrors,
        });
      });
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

  render() {
    return (
      <div className="container bg-light p-3 my-3">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label for="exampleFormControlFile1">Photo</label>
            <input
              type="file"
              onChange={this.handleInputChange}
              name="photo"
              className="form-control-file"
              id="exampleFormControlFile1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlInput1">Title</label>
            <input
              type="text"
              onChange={this.handleInputChange}
              name="title"
              className={`form-control ${
                this.state.errors["title"] && "is-invalid"
              }`}
              id="exampleFormControlInput1"
              placeholder="Title"
            />

            {this.state.errors["title"] && (
              <div className="invalid-feedback">
                {this.state.errors["title"]}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Body</label>
            <textarea
              className={`form-control ${
                this.state.errors["body"] && "is-invalid"
              }`}
              onChange={this.handleInputChange}
              name="body"
              id="exampleFormControlTextarea1"
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
              selectedValues={this.state.selectedValue}
              onSelect={this.onSelect}
              onRemove={this.onRemove} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
              placeholder="Select Peoples To Tag"
              emptyRecordMsg="No People Found"
            />
          </div>
          <button class="btn btn-primary">Create</button>
        </form>
      </div>
    );
  }
}

export default NewPost;
