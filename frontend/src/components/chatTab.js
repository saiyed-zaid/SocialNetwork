import React, { Component } from "react";
import DefaultProfile from "../images/avatar.jpg";
import openSocket from "socket.io-client";

export default class chatTab extends Component {
  handleClose = () => {
    let chattab = document.getElementById("chattab");
    chattab.style.display = "none";
  };
  constructor(props) {
    super(props);

    this.masterUl = document.createElement("ul");
    this.masterUl.setAttribute("id", "myMsg");
    this.masterUl.classList.add("p-0", "m-0");
    this.masterUl.style.listStyle = "none";

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
    if (this.props.messages) {
      this.props.messages.forEach((message) => {
        const li = this.appendReceivedMsg(message);
        this.masterUl.appendChild(li);
      });
    }
    /* APPENDING PREVIOUS MESSAGES BEGIN */

    /* SEND MESSAGE WHEN ENTER KEY PRESS BEGIN */
    window.onkeypress = (e) => {
      if (e.keyCode === 13) {
        this.handleSend();
      }
    };
    /* SEND MESSAGE WHEN ENTER KEY PRESS OVER */
  }
  componentDidMount() {
    const chatBox = document.querySelector("#chatBox");
    chatBox.appendChild(this.masterUl);
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
      appendLi.classList.add("text-right", "p-1", "m-1");
      appendMsg.innerHTML =
        data.message /* + " (" + this.props.senderName + ")" */;
      appendMsg.classList.add("bg-dark", "rounded", "layout");
    } else {
      appendLi.classList.add("text-left", "text-dark", "p-1", "m-1");
      appendMsg.style.backgroundColor = "royalblue";
      appendMsg.classList.add("rounded");

      appendMsg.innerHTML =
        /* " (" + this.props.receiverName + ") "  +*/ data.message;
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
    this.socket.emit("msg", {
      message: msg.value,
      sender: this.props.senderId,
      receiver: this.props.receiverId,
    });

    let myMsg = document.querySelector("#myMsg");

    /* if (data.msg.length === 0) {
      return alert("Please enter msg");
    } */
    const appendLi = document.createElement("li");
    const appendMsg = document.createElement("span");
    const personImg = document.createElement("img");

    //add new message
    appendLi.classList.add("text-right", "P-1");

    appendMsg.classList.add("p-1");
    appendMsg.innerHTML = msg.value + " (" + this.props.senderName + ")";

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
              onClick={this.props.handleChatBoxDisplay}
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
          {/* <ul className="p-0 m-0" id="myMsg" style={{ listStyle: "none" }}></ul> */}
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
              <button
                className="btn text-light"
                style={{
                  border: "1px solid #1a1d24",
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                }}
                onClick={this.handleSend}
              >
                <i className="fas fa-send"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
