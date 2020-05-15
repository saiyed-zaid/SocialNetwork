import React, { Component } from "react";

export default class goToTop extends Component {
  scrollFunction = () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      let mybutton = document.getElementById("gototop");

      mybutton.style.display = "block";
    } else {
      let mybutton = document.getElementById("gototop");

      mybutton.style.display = "none";
    }
  };
  componentDidMount() {
    window.onscroll = () => this.scrollFunction();
  }
  gotToTop = () => {
    document.documentElement.scrollTop = 0;
  };
  render() {
    return (
      <button
        onClick={this.gotToTop}
        id="gototop"
        className="gototop"
        data-toggle="tooltip"
        data-placement="top"
        title="Jump To Top "
      >
        <i class="fas fa-arrow-up"></i>
      </button>
    );
  }
}
