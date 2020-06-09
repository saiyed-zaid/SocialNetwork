import React, { Component } from "react";
import defaultProfile from "../../images/avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

export default class Chatbar extends Component {
  OnClose = () => {
    let chatbar = document.getElementById("chatbar");
    chatbar.classList.add("close-chatbar");

    // chatbar.addEventListener("animationend", () => {
    chatbar.classList.remove("close-chatbar");
    // });
    chatbar.style.display = "none";
    document.getElementById("floating-btn").style.display = "block";
  };

  render() {
    return (
      <div id="chatbar" className="sidebar">
        <div
          style={{
            cursor: "pointer",
          }}
          className="bg-primary d-flex justify-content-start text-light align-items-center"
        >
          &nbsp;
          <FontAwesomeIcon
            icon={faArrowCircleRight}
            onClick={this.OnClose}
            className="text-light"
          />
          <span className="">Online</span>
        </div>
        <ul className="text-light p-0 m-0" style={{ listStyleType: "none" }}>
          {this.props.data.map((user, i) => (
            <li className="p-2 m-0 bg-dark" key={i}>
              <img
                className="col-sm-4"
                src={user.photo ? user.photo.photoURI : defaultProfile}
                alt={user.name}
                style={{ borderRadius: "50%" }}
                onError={(e) => (e.target.src = defaultProfile)}
              />
              <button
                className="text-primary chat-list"
                data-userId={user._id}
                data-name={user.name}
                onClick={() => this.props.handleOpen(user)}
                style={{ background: "transparent", border: "transparent" }}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
