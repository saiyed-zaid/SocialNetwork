import React, { Component } from "react";
import Posts from "../post/Posts";
class Home extends Component {
  constructor() {
    super();
    this.state = { loaderIsLoading: true };
  }

  loader = () => {
    return (
      <div class="loader">
        <div class="loader-inner">
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
        </div>
      </div>
    );
  };
  componentWillMount() {
    setTimeout(() => {
      this.setState({ loaderIsLoading: false });
    }, 1000);
  }

  render() {
    if (this.state.loaderIsLoading) return this.loader();
    return (
      <div>
        <div>
          <div className="jumbotron p-3">
            <h2>Home</h2>
          </div>
          <div className="container-fluid">
            <Posts />
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
