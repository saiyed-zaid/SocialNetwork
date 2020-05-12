import React, { Component } from "react";
import Posts from "../post/posts";
import Notification from "./components/Notification";
import Chattab from "../components/chatTab";

class Home extends Component {
  constructor() {
    super();

    this.state = {
      loaderIsLoading: true,
    };
  }

  componentDidMount() {
    document.title = "Social Network | HOME";
  }

  render() {
    return (
      <div className="container">
        <div
          id="chat-tab"
          className="d-flex justify-content-end align-items-end chat-box"
        ></div>
        {/* Loding Post Begin */}
            <Posts />
        {/* Loding Post Over */}
      </div>
    );
  }
}
export default Home;
