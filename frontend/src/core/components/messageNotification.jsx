import React, { Component } from "react";
import { fetchNewMessage } from "../api/getNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faCommentAlt } from "@fortawesome/free-solid-svg-icons";

export default class messageNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    fetchNewMessage().then((response) => {
      if (response.status === 401) {
        localStorage.removeItem("jwt");
        this.props.history.push("/signin");
      }
      if (response.data.err) {
        console.log(response.data.err);
      } else {
        this.setState({ messages: response.data });
      }
    });
  }

  render() {
    const { messages } = this.state;
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link   "
          href="/"
          id="navbarDropdownMenuLink"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <FontAwesomeIcon icon={faComments} />
          <span className="badge badge-danger ml-1">{messages.length}</span>
        </a>
        <div
          className="dropdown-menu dropdown-menu-lg-right"
          aria-labelledby="navbarDropdownMenuLink"
        >
          {messages.length > 0 &&
            messages.map((user, i) => (
              <button
                className="dropdown-item"
                onClick={() => this.props.handleOpen(user)}
                key={i}
              >
                <p className=" text-primary">
                  <FontAwesomeIcon icon={faCommentAlt} /> &nbsp;&nbsp; You Have
                  New Message From {user.users.name}
                </p>
              </button>
            ))}
          {messages.length === 0 && (
            <button className="dropdown-item">
              <span className="text-dark">No Messages</span>
            </button>
          )}
        </div>
      </li>
    );
  }
}
