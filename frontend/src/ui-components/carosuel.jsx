import DefaultPost from "../images/post.jpg";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import React, { Component } from "react";

export default class carosuel extends Component {
  getExt = (filepath) => {
    return filepath.split("?")[0].split("#")[0].split(".").pop();
  };
  render() {
    return (
      <div>
        <OwlCarousel
          items={1}
          className="owl-theme"
          loop
          mergeFit="false"
          video
        >
          {this.props.images.map((image, index) =>
            this.getExt(image) === "mp4" ? (
              <video className=" w-100" controls key={index}>
                <source src={image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                id={index + "sdf"}
                key={index + "sdf"}
                src={image}
                className="d-block w-100"
                alt="post "
                onError={(i) => (i.target.src = `${DefaultPost}`)}
              />
            )
          )}
        </OwlCarousel>
      </div>
    );
  }
}
