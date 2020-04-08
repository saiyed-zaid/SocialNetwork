import React, { Component } from "react";
import Posts from "../post/posts";
import  Notification  from "./components/Notification";
import Chattab from "../components/chatTab";
class Home extends Component {
  constructor() {
    super();
    this.state = {
      loaderIsLoading: true
    };
  }

  loader = () => {
    return (
      <div className="loader">
        <div className="loader-inner">
          <div className="loader-line-wrap">
            <div className="loader-line"></div>
          </div>
          <div className="loader-line-wrap">
            <div className="loader-line"></div>
          </div>
          <div className="loader-line-wrap">
            <div className="loader-line"></div>
          </div>
          <div className="loader-line-wrap">
            <div className="loader-line"></div>
          </div>
          <div className="loader-line-wrap">
            <div className="loader-line"></div>
          </div>
        </div>
      </div>
    );
  };
  /*  componentDidMount() {
    setTimeout(() => {
      this.setState({ loaderIsLoading: false });
    }, 1000);
  }
 */
 
  render() {

    return (
      <div className="m-3">
        <Notification />
        <div id="chat-tab" className="d-flex justify-content-end align-items-end chat-box">

        {/* <Chattab username="zaid"/> */}
        </div>
        {/* Loding Post Begin */}
        <div>
          <div className="jumbotron p-0">
            <h4>Recent Posts</h4>
          </div>
          <div className="container-fluid">
            <Posts />
          </div>
        </div>
        {/* Loding Post Over */}
      </div>
    );
  }
}
export default Home;
