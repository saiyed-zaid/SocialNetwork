import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class pageLoader extends Component {
  render() {
    return ReactDOM.createPortal(
      <div className="loader-top"></div>,
      document.getElementById("loader")
    );
  }
}
