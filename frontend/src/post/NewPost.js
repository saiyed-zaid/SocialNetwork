import React from "react";
import { Multiselect } from "multiselect-react-dropdown";

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
    this.multiselectRef = React.createRef();
    this.selectedopt = [];
  }

  async componentDidMount() {
    /* this.setState({ user: this.props.authUser }); */
    try {
      const data = await this.props.read(
        this.props.authUser._id,
        this.props.authUser.token
      );
      if (data.err) {
        this.setState({ options: [] });
      } else {
        this.setState({ options: data.following });
      }
    } catch (errors) {
      this.setState({ errors });
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

      this.postData.set(event.target.name, value);

      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = this.state;
    this.postData.append("tags", JSON.stringify(this.selectedopt));

    /* const userId = this.props.authUser._id;
    const token = this.props.authUser.token; */

    try {
      this.setState({ errors: {} });

      await this.props.addPost(
        this.postData,
        data,
        this.props.authUser._id,
        this.props.authUser.token
      );

      this.props.history.push(`/user/${this.props.authUser._id}`);
    } catch (errors) {
      this.setState({
        errors,
      });
    }
  };

  onSelect = (selectedList, selectedItem) => {
    this.selectedopt.push(selectedItem._id);
  };

  onRemove(selectedList, removedItem) {
    this.setState(
      { tags: selectedList },
      this.postData.set("tags", selectedList.name)
    );
  }

  render() {
    return (
      <div className="container p-3 my-3" style={{backgroundColor:'#1f2022',color: "#c0c8d0",}}>
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
          <button className="btn btn-primary">Create</button>
        </form>
      </div>
    );
  }
}

export default NewPost;
