import React, { Component } from "react";
import { fetchNewMessage } from "../api/getNotification";

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
        console.log(data);

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
          <i className="far fa-comments" />
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
              {console.log(user)}
              <p className="text-dark">
                You Have New Message From {user.users.name}
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
