import React, { Component } from "react";
import Posts from "../post/posts";
import GoToTop from "../ui-components/goToTop";

class Home extends Component {
  constructor() {
    super();

    this.state = {
      loaderIsLoading: true,
    };
  }

  componentDidMount() {
    document.title = "Retwit | HOME";
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
        <GoToTop/>
      </div>
    );
  }
}
export default Home;
