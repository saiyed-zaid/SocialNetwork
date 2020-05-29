import React, { Component } from "react";
import { fetchNewMessage } from "../api/getNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faCommentAlt } from "@fortawesome/free-solid-svg-icons";

export default class messageNotification extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    fetchNewMessage().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ messages: data });
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
          {messages.map((user, i) => (
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
              <p className="text-dark">No Messages</p>
            </button>
          )}
        </div>
      </li>
    );
  }
}
