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
      <div className="m-3">
        <div
          id="chat-tab"
          className="d-flex justify-content-end align-items-end chat-box"
        ></div>
        {/* Loding Post Begin */}
        <div>
          <div className="jumbotron p-0">
            <h4>Recent Posts</h4>
          </div>
          <div className="container">
            <Posts />
          </div>
        </div>
        {/* Loding Post Over */}
      </div>
    );
  }
}
export default Home;
