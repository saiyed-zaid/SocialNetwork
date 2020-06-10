import React, { Component } from "react";
import DefaultProfile from "../images/avatar.jpg";
import openSocket from "socket.io-client";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Draggable from "react-draggable"; // Both at the same time

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

    /* INVOKED WHENEVER SOMEONE MESSAGE YOU -BEGIN*/
    this.socket = openSocket("https://retwit-backend.herokuapp.com");
    this.socket.on(this.props.senderId, (data) => {
      const li = this.appendReceivedMsg(data);
      let myMsg = document.querySelector("#myMsg");
      const chatBox = document.querySelector("#chatBox");
      myMsg.appendChild(li);
      chatBox.scrollTo(0, chatBox.scrollHeight);
    });
    /* INVOKED WHENEVER SOMEONE MESSAGE YOU -BEGIN*/

    /* SEND MESSAGE WHEN ENTER KEY PRESS BEGIN */
    window.onkeypress = (e) => {
      if (e.keyCode === 13) {
        this.handleSend();
      }
    };
    /* SEND MESSAGE WHEN ENTER KEY PRESS OVER */
  }

  async componentDidMount() {
    try {
      const result = await this.props.fetchMessage(
        this.props.senderId,
        this.props.receiverId,
        this.props.authUser.token
      );

      this.setState({
        hasNewMsg: true,
        receiverId: this.props.senderId,
        receiverName: this.props.senderName,
        messages: result.data,
      });
    } catch (error) {
      console.log(error);
    }

    const chatBox = document.querySelector("#chatBox");

    chatBox.scrollTo(0, chatBox.scrollHeight);
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.receiverId !== this.props.receiverId) {
      try {
        const result = await this.props.fetchMessage(
          this.props.senderId,
          this.props.receiverId,
          this.props.authUser.token
        );

        this.setState({
          hasNewMsg: true,
          receiverId: this.props.senderId,
          receiverName: this.props.senderName,
          messages: result,
        });
      } catch (error) {
        console.log(error);
      }

      const chatBox = document.querySelector("#chatBox");

      chatBox.scrollTo(0, chatBox.scrollHeight);
    }
  }

  appendReceivedMsg = (data) => {
    // console.log(data);

    const appendLi = document.createElement("li");
    const appendMsg = document.createElement("span");
    const personImg = document.createElement("img");

    //add new message
    if (data.sender === this.props.senderId) {
      appendLi.classList.add("text-right", "P-1");
      appendMsg.innerHTML = data.message;
    } else {
      appendLi.classList.add("text-left", "P-1");
      appendMsg.innerHTML = data.message;
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

    msg &&
      this.socket.emit("msg", {
        message: msg.value,
        sender: this.props.senderId,
        senderName: this.props.senderName,
        receiver: this.props.receiverId,
      });

    // if (msg.value.length === 0) {

    if (msg.value.length === 0) {
      return alert("You Can't Send Blank Message");
    }
    const appendLi = document.createElement("li");
    const appendMsg = document.createElement("span");
    const personImg = document.createElement("img");

    //add new message
    appendLi.classList.add("text-right", "p-1");

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
  addEmoji = (e) => {
    const msg = document.querySelector("#btn-input");
    let emoji = e.native;
    msg.value += emoji;
  };
  showEmoji = () => {
    this.setState({ displayEmoji: !this.state.displayEmoji });
  };
  render() {
    const { messages } = this.state;
    return (
      <Draggable
        axis="both"
        handle=".handle"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        grid={[1, 1]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div>
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
            <div className="card-header text-left text-light bg-dark handle">
              <span>{this.props.receiverName}</span>
              <span style={{ marginLeft: "10px" }}></span>
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
              className="card-body chat-text bg-secondary text-light "
              id="chatBox"
              style={{ height: "200px", overflowY: "scroll", padding: "5px" }}
            >
              <ul className="p-0 m-0" id="myMsg" style={{ listStyle: "none" }}>
                {messages &&
                  messages.map((msg, i) =>
                    msg.sender === this.props.authUser._id ? (
                      <div className="bubbleWrapper">
                        <div className="inlineContainer own">
                          <img
                            className="inlineIcon"
                            src={
                              this.props.authUser
                                ? this.props.authUser.photo.photoURI
                                : DefaultProfile
                            }
                            alt="user"
                          />
                          <div className="ownBubble own">{msg.message}</div>
                        </div>
                        <span className="own text-dark">
                          {moment(msg.created).format("LT")}
                        </span>
                      </div>
                    ) : (
                      <div className="bubbleWrapper">
                        <div className="inlineContainer">
                          <img
                            className="inlineIcon"
                            src={
                              msg.receiver.photo
                                ? msg.receiver.photo.photoURI
                                : DefaultProfile
                            }
                            alt="user"
                          />

                          <div className="otherBubble other">{msg.message}</div>
                        </div>
                        <span className="other text-dark text-sm">
                          {moment(msg.created).format("LT")}
                        </span>
                      </div>
                    )
                  )}
              </ul>
            </div>
            <div className="card-footer bg-dark">
              <div className="input-group">
                <input
                  id="btn-input"
                  type="text"
                  className="form-control input-sm"
                  placeholder="Enter Message..."
                />
                <span className="input-group-btn">
                  <button className="btn" onClick={this.showEmoji}>
                    <FontAwesomeIcon icon={faSmile} className=" text-warning" />
                  </button>
                  <button
                    className="btn text-light bg-dark"
                    style={{
                      border: "1px solid #1a1d24",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0",
                    }}
                    onClick={this.handleSend}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
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
        </div>
      </Draggable>
    );
  }
}
