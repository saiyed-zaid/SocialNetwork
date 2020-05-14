import React from "react";
import { Link, Redirect } from "react-router-dom";
import Alert from "../../ui-components/Alert";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      errors: {},
      responseError: null,
    };

    this.postData = new FormData();
  }

  handleInputChange = (event) => {
    this.postData.set(event.target.name, event.target.value);

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      this.setState({ errors: {} });

      const response = await this.props.registerUser(this.state);

      this.props.history.push("/signin");
    } catch (errors) {
      this.setState({
        errors,
      });
    }
  };

  render() {
    return (
      <div className="container bg-light p-2 my-3 col-md-4">
        <div className="jumbotron" style={{ padding: "0.5rem 2rem" }}>
          {this.state.responseError && (
            <Alert message={this.state.responseError} type="danger" />
          )}
          <h2>Signup</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Name</label>
              <input
                type="text"
                name="name"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["name"] && "is-invalid"
                }`}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />

              {this.state.errors["name"] && (
                <div className="invalid-feedback">
                  {this.state.errors["name"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                name="email"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["email"] && "is-invalid"
                }`}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />

              {this.state.errors["email"] && (
                <div className="invalid-feedback">
                  {this.state.errors["email"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="password"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["password"] && "is-invalid"
                }`}
                id="exampleInputPassword1"
              />

              {this.state.errors["password"] && (
                <div className="invalid-feedback">
                  {this.state.errors["password"]}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                onChange={this.handleInputChange}
                className={`form-control ${
                  this.state.errors["password_confirmation "] && "is-invalid"
                }`}
                id="exampleInputPassword1"
              />

              {this.state.errors["password_confirmation "] && (
                <div className="invalid-feedback">
                  {this.state.errors["password_confirmation "]}
                </div>
              )}
            </div>

            <div className="row">
              <div className="col">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="col">
                <Link
                  className="stretched-link"
                  to="/signin"
                  style={{ color: "unset" }}
                >
                  Login Instead
                </Link>
              </div>
            </div>

            <hr className="my-4" />
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
