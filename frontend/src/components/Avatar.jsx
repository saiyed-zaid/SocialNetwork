import React from "react";
import DefaultProfile from "../images/avatar.jpg";

class Avatar extends React.Component {
  render() {
    return (
      <div
        className={this.props.class}
        key={this.props.ckey}
        style={{ height: "30px", width: "30px" }}
      >
        <img
          src={this.props.src}
          onError={(e) => (e.target.src = `${DefaultProfile}`)}
          alt="zaid"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    );
  }
}

export default Avatar;
