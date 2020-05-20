import DefaultPost from "../images/post.jpg";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import React, { Component } from "react";

export default class carosuel extends Component {
  render() {
    return (
      <div>
        <OwlCarousel items={1} className="owl-theme" loop mergeFit="false">
          {this.props.images.map((image, index) => (
            <img
              id={index}
              src={image}
              className="d-block w-100"
              alt="post "
              onError={(i) => (i.target.src = `${DefaultPost}`)}
            />
          ))}
        </OwlCarousel>
      </div>
    );
  }
}
