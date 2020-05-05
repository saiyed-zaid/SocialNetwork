import React from "react";
import { validateAll } from "indicative/validator";
import { create } from "./apiPost";

class NewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      photo: "",
      fileSize: 0,
      errors: {},
      photo: null,
    };

    this.postData = new FormData();
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
          <button class="btn btn-primary">Submit</button>{" "}
        </form>
      </div>
    );
  }
}

export default NewPost;
