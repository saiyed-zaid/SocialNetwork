import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";

class NewPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
      photo: "",
      isSchedule: false,
      postScheduleTime: "",
      fileSizes: [],
      options: [],
      errors: {},
    };
    this.postData = new FormData();
    this.multiselectRef = React.createRef();
    this.selectedopt = [];
  }

  async componentDidMount() {
    /* this.setState({ user: this.props.authUser }); */
    try {
      const response = await this.props.read(
        this.props.authUser._id,
        this.props.authUser.token
      );
      if (response.status === 200) {
        this.setState({ options: response.data.following });
      } else {
        this.setState({ options: [] });
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

      if (event.target.name !== "isSchedule") {
        this.setState({
          [event.target.name]: event.target.value,
        });
      } else if (event.target.name === "isSchedule") {
        Boolean(event.target.value) &&
          this.setState({
            [event.target.name]: event.target.value,
          });

        !Boolean(event.target.value) &&
          this.setState({
            [event.target.name]: event.target.value,
            postScheduleTime: "",
          });
      }
    }
  };
  diff_years = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 24;
    return Math.abs(Math.round(diff));
  };

  handleScheduleChange = (event) => {
    this.postData.set("postScheduleTime", event);
    this.setState({
      postScheduleTime: event,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = this.state;
    if (this.selectedopt.length > 0) {
      this.postData.append("tags", JSON.stringify(this.selectedopt));
    }

    try {
      this.setState({ errors: {} });

      const response = await this.props.addPost(
        this.postData,
        data,
        this.props.authUser._id,
        this.props.authUser.token
      );
      if (response.status === 200) {
        this.props.history.push(`/user/${this.props.authUser._id}`);
      }
    } catch (errors) {
      this.setState({
        errors,
      });
    }
  };

  onSelect = (selectedList, selectedItem) => {
    // console.log(selectedItem);

    this.selectedopt.push(selectedItem);
  };

  onRemove = (selectedList, removedItem) => {
    this.setState(
      { tags: selectedList },
      this.postData.set("tags", selectedList)
    );
  };

  render() {
    let cdate = new Date();
    let checkDate = setHours(
      setMinutes(cdate, cdate.getMinutes()),
      cdate.getHours()
    );

    return (
      <div
        className="container p-3 my-3 col-md-6"
        style={{ backgroundColor: "#343a40", color: "#c0c8d0" }}
      >
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

          <div className="form-group">
            <label htmlFor="">Schedule Post</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isSchedule"
                  id="isSchedule"
                  value="true"
                  onChange={this.handleInputChange}
                />
                <label className="form-check-label" htmlFor="isSchedule">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isSchedule"
                  id="isSchedule"
                  value={null}
                  onChange={this.handleInputChange}
                />
                <label className="form-check-label" htmlFor="isSchedule">
                  No
                </label>
              </div>
            </div>
          </div>
          {Boolean(this.state.isSchedule) && (
            <div className="form-group">
              <label htmlFor="">Set Schedule</label>
              <DateTimePicker
                selected={this.state.postScheduleTime}
                onChange={this.handleScheduleChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                key="schedulePost"
                minTime={checkDate}
                minDate={new Date()}
                maxTime={setHours(setMinutes(new Date(), 30), 20)}
              />
            </div>
          )}

          <button className="btn btn-primary">Create</button>
        </form>
      </div>
    );
  }
}

export default NewPost;
