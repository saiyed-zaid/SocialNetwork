import React, { Component } from "react";
import Posts from "../post/Posts";
class Home extends Component {
  constructor() {
    super();
    this.state = { loaderIsLoading: true };
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
    // if (this.state.loaderIsLoading) return this.loader();
    return (
      <div>
        <div>
          <div className="jumbotron p-3">
            <h4>Recent Posts</h4>
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
