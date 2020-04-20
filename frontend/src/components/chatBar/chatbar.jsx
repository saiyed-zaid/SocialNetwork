import React, { Component } from "react";
import defaultProfile from "../../images/avatar.jpg";

// import classes from "./chatbar.css";

export default class chatbar extends Component {
  OnClose = () => {
    let chatbar = document.getElementById("chatbar");
    chatbar.classList.add("close-chatbar");

    // chatbar.addEventListener("animationend", () => {
    chatbar.style.display = "none";
    // document.getElementById("floating-btn").style.display = "block";
    // });
  };

  render() {
    return (
      <div id="chatbar" className="sidebar">
        <div
          className="p-0"
          style={{
            // height: "50px",
            backgroundColor: "#029cf4",
            cursor: "pointer",
          }}
        >
          <i
            onClick={this.OnClose}
            className="fas fa-caret-right text-danger col-sm-2"
          ></i>
          <span className="col-sm-10 text-center text-light">Online</span>
        </div>
        <ul className="text-light p-0 m-0" style={{ listStyleType: "none" }}>
          {this.props.data.map((user, i) =>
            user.isLoggedIn === true ? (
              <li className="p-2 m-0 bg-dark" key={i}>
                <img
                  className="col-sm-4"
                  src={
                    user.photo
                      ? `${process.env.REACT_APP_API_URL}/${user.photo.path}`
                      : defaultProfile
                  }
                  alt={user.name}
                  style={{ borderRadius: "50%" }}
                  onError={(e) => (e.target.src = defaultProfile)}
                />
                <button
                  className="text-primary chat-list"
                  data-userId={user._id}
                  data-name={user.name}
                  onClick={this.props.hasChatBoxDisplay}
                  style={{ background: "transparent", border: "transparent" }}
                >
                  {user.name}
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    );
  }
}
