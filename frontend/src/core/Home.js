import React from "react";
import Posts from "../post/Posts";
const Home = props => {
  return (
    <div>
      <div className="jumbotron p-3">
        <h4>Recent Posts</h4>
      </div>
      <div className="container-fluid">
        <Posts />
      </div>
    </div>
  );
};
export default Home;
