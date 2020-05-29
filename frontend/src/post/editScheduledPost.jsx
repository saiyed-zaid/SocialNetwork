import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import DefaultPost from "../images/post.jpg";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class editScheduledPost extends Component {
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
      postScheduleTime: "",
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
      const response = await this.props.fetchScheduledPost(postId);

      if (response.status === 200) {
        this.setState({
          id: response.data._id,
          title: response.data.title,
          body: response.data.body,
          error: "",
          photo: response.data.photo ? response.data.photo : DefaultPost,
          user: this.props.authUser,
          options: response.data.following,
          selectedTags: response.data.tags,
          postScheduleTime: response.data.scheduleTime,
        });
      } else {
        this.setState({ redirectToProfile: true });
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

      this.postData.set(event.target.name, value);

      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleScheduleChange = (event) => {
    const date2 = new Date(event);

    this.postData.set("scheduleTime", date2);
    this.setState({
      postScheduleTime: date2,
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    let datas = this.state;
    const token = this.props.authUser.token;

    if (this.selectedopt.length > 0) {
      this.postData.append("tags", JSON.stringify(this.selectedopt));
    }

    try {
      this.setState({ errors: {} });

      await this.props.editScheduledPost(
        datas,
        this.postData,
        this.state.id,
        token
      );

       //this.props.history.push(`/user/${userId}`);
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

          <div className="form-group text-light">
            <label htmlFor="">Change Scheduled Time</label>
            <br />
            <DateTimePicker
              className="form-control"
              selected={
                this.state.postScheduleTime &&
                new Date(this.state.postScheduleTime)
              }
              onChange={this.handleScheduleChange}
              showTimeSelect
              timeIntervals={5}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm a"
              key="schedulePost"
              // minTime={checkDate}
              /* minDate={new Date()} */
              // maxTime={setHours(setMinutes(new Date(), 30), 20)}
            />
          </div>
          <button className="btn btn-primary">Edit</button>
        </form>
      </div>
    );
  }
}
