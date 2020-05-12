import React, { Component } from "react";

export default class changePassword extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      old: "",
      new: "",
      confirm: "",
    };
  }
  async componentDidMount() {
    const response = await this.props.read(
      this.props.authUser._id,
      this.props.authUser.token
    );
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    /* const userId = this.props.authUser._id;
    const token = this.props.authUser.token; */

    try {
      this.setState({ errors: {} });
    } catch (errors) {
      this.setState({
        errors,
      });
    }
  };
  render() {
    return (
      <div className="container">
        <div className="jumbotron text-center">
          <h1 className="display-5">Change Password</h1>
        </div>
        <div className="row justify-content-md-center">
          <form className="col-md-4 bg-light p-4 rounded">
            <div className="form-group ">
              <input
                type="password"
                className="form-control"
                id="old"
                name="old"
                placeholder="Enter Your  Old Password"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="new"
                name="new"
                placeholder="Enter New Password"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="confirm"
                name="confirm"
                placeholder="Confirm New Password"
                onChange={this.handleInputChange}
              />
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              Change password
            </button>
          </form>
        </div>
      </div>
    );
  }
}
