import React from "react";

class NewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      photo: "",
      fileSizes: [],
      errors: {},
    };

    this.postData = new FormData();
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

      this.postData.set(event.target.name, value);

      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = this.state;

    const userId = this.props.authUser._id;
    const token = this.props.authUser.token;

    try {
      this.setState({ errors: {} });

      const response = await this.props.addPost(
        this.postData,
        data,
        userId,
        token
      );

      console.log("posted", response);
      this.props.history.push(`/user/${userId}`);
    } catch (errors) {
      console.log("error", errors);
      this.setState({
        errors,
      });
    }
  };

  render() {
    return (
      <div className="container bg-light p-3 my-3">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label for="photo">Photo</label>
            <input
              type="file"
              onChange={this.handleInputChange}
              name="photo"
              className="form-control-file"
              id="photo"
              multiple={true}
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              onChange={this.handleInputChange}
              name="title"
              className={`form-control ${
                this.state.errors["title"] && "is-invalid"
              }`}
              id="title"
              placeholder="Title"
            />

            {this.state.errors["title"] && (
              <div className="invalid-feedback">
                {this.state.errors["title"]}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="body">Body</label>
            <textarea
              className={`form-control ${
                this.state.errors["body"] && "is-invalid"
              }`}
              onChange={this.handleInputChange}
              name="body"
              id="body"
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
