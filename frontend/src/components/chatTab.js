import React, { Component } from "react";
import DefaultProfile from "../images/avatar.jpg";
import openSocket from "socket.io-client";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
// import { fetchMessage } from "../user/apiUser";

export default class chatTab extends Component {
  handleClose = () => {
    let chattab = document.getElementById("chattab");

    chattab.style.display = "none";
  };
  constructor(props) {
    super(props);
    this.state = {
      emoji: "",
      displayEmoji: false,
      msgText: "",
      messages: null,
    };

    /*    this.masterUl = document.createElement("ul");
    this.masterUl.setAttribute("id", "myMsg");
    this.masterUl.classList.add("p-0", "m-0");
    this.masterUl.style.listStyle = "none"; */

    /* INVOKED WHENEVER SOMEONE MESSAGE YOU -BEGIN*/
    this.socket = openSocket("http://localhost:5000");
    this.socket.on(this.props.senderId, (data) => {
      const li = this.appendReceivedMsg(data);
      let myMsg = document.querySelector("#myMsg");
      const chatBox = document.querySelector("#chatBox");
      myMsg.appendChild(li);
      chatBox.scrollTo(0, chatBox.scrollHeight);
    });
    /* INVOKED WHENEVER SOMEONE MESSAGE YOU -BEGIN*/

    /* APPENDING PREVIOUS MESSAGES BEGIN */
    /* if (this.state.messages) {
      alert("set");
       
    } */
    /* APPENDING PREVIOUS MESSAGES BEGIN */

    /* SEND MESSAGE WHEN ENTER KEY PRESS BEGIN */
    window.onkeypress = (e) => {
      if (e.keyCode === 13) {
        this.handleSend();
      }
    };
    /* SEND MESSAGE WHEN ENTER KEY PRESS OVER */
  }

  async componentDidMount() {
    /* Fetching Message When This Component INVOKED */
    /*END Fetching Message When This Component INVOKED */

    const result = await this.props.fetchMessage(
      this.props.senderId,
      this.props.receiverId,
      this.props.authUser.token
    );
    this.setState(
      {
        hasNewMsg: true,
        receiverId: this.props.senderId,
        receiverName: this.props.senderName,
        messages: result,
      },
      () => {
        let myMsg = document.querySelector("#myMsg");
        const chatBox = document.querySelector("#chatBox");

        chatBox.scrollTo(0, chatBox.scrollHeight);

        this.state.messages.forEach((message) => {
          const li = this.appendReceivedMsg(message);
          myMsg.appendChild(li);
        });
      }
    );

    const chatBox = document.querySelector("#chatBox");

    chatBox.scrollTo(0, chatBox.scrollHeight);
  }

  appendReceivedMsg = (data) => {
    /* if (data.msg.length === 0) {
      return alert("Please enter msg");
    } */
    const appendLi = document.createElement("li");
    const appendMsg = document.createElement("span");
    const personImg = document.createElement("img");

    //add new message
    if (data.sender === this.props.senderId) {
      appendLi.classList.add("text-right", "P-1");
      appendMsg.innerHTML = data.message + " (" + this.props.senderName + ")";
    } else {
      appendLi.classList.add("text-left", "P-1");
      appendMsg.innerHTML =
        " (" + this.props.receiverName + ") " + data.message;
    }
    appendMsg.classList.add("p-1");

    //set person photo
    personImg.src = DefaultProfile;
    personImg.style.cssText = "border-radius: 50%;height: 15px; width: 15px;";

    appendLi.appendChild(personImg);
    appendLi.appendChild(appendMsg);

    //append to master ul
    //myMsg.appendChild(appendLi);
    return appendLi;
    //chatBox.scrollTo(0, chatBox.scrollHeight);
  };

  handleSend = () => {
    const msg = document.querySelector("#btn-input");
    const chatBox = document.querySelector("#chatBox");
    let myMsg = document.querySelector("#myMsg");

    this.socket.emit("msg", {
      message: msg.value,
      sender: this.props.senderId,
      senderName: this.props.senderName,
      receiver: this.props.receiverId,
    });

    // if (msg.value.length === 0) {

    /* if (data.msg.length === 0) {
      return alert("Please enter msg");
    }*/
    const appendLi = document.createElement("li");
    const appendMsg = document.createElement("span");
    const personImg = document.createElement("img");

    //add new message
    appendLi.classList.add("text-right", "P-1");

    appendMsg.classList.add("p-1");
    appendMsg.innerHTML =
      msg.value + this.state.emoji + " (" + this.props.senderName + ")";

    //set person photo
    personImg.src = DefaultProfile;
    personImg.style.cssText = "border-radius: 50%;height: 15px; width: 15px;";

    appendLi.appendChild(appendMsg);
    appendLi.appendChild(personImg);

    //append to master ul

    myMsg.appendChild(appendLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);

    msg.value = "";

    /* DATABASE HANDLING */
  };

  showEmoji = () => {
    this.setState({ displayEmoji: !this.state.displayEmoji });
  };
  render() {
    return (
      <div
        id="chattab"
        className="card"
        style={{
          display: "block",
          transform: "none",
          animation: "none",
          transition: "none",
          maxWidth: "283px",
        }}
      >
        <div className="card-header text-left text-light bg-dark">
          <span>{this.props.senderName}</span>
          <span style={{ marginLeft: "10px" }}>
            <i className="fas fa-video"></i>
          </span>
          <span className="float-right">
            <button
              type="button"
              className="close text-light"
              aria-label="Close"
              onClick={this.handleClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </div>
        <div
          className="card-body chat-text bg-secondary text-light"
          id="chatBox"
          style={{ height: "200px", overflowY: "scroll" }}
        >
          <ul className="p-0 m-0" id="myMsg" style={{ listStyle: "none" }}></ul>
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              id="btn-input"
              type="text"
              className="form-control input-sm"
              placeholder="Enter Message..."
            />
            <span className="input-group-btn">
              <button className="btn" onClick={this.showEmoji}>
                <i className="fas fa-smile text-warning"></i>
              </button>
              <button
                className="btn text-light"
                style={{
                  border: "1px solid #1a1d24",
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                }}
                onClick={this.handleSend}
              >
                <i className="fa fa-send"></i>
              </button>
            </span>
          </div>
        </div>
        {this.state.displayEmoji ? (
          <span>
            <Picker
              onSelect={this.addEmoji}
              perLine="7"
              showPreview="FALSE"
              theme="dark"
              // native
            />
          </span>
        ) : null}
      </div>
    );
  }
}
