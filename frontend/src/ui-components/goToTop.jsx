import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default class goToTop extends Component {
  scrollFunction = () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      let mybutton = document.getElementById("gototop");
      if (mybutton) {
        mybutton.style.display = "block";
      }
    } else {
      let mybutton = document.getElementById("gototop");
      if (mybutton) {
        mybutton.style.display = "none";
      }
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
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    );
  }
}
