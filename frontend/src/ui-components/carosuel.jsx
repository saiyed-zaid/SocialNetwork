import React from "react";
import DefaultPost from "../images/post.jpg";

const Carosuel = (props) => {
  return (
    <div id={props.index} className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            className="d-block w-100"
            src="https://fakeimg.pl/350x200/?text=SwipeLeft&font=lobster"
            alt="First slide"
          />
        </div>
        {props.images.map((image, index) => (
          <div className="carousel-item">
            <img
              src={image}
              className="d-block w-100"
              alt="post "
              onError={(i) => (i.target.src = `${DefaultPost}`)}
            />
          </div>
        ))}
      </div>
      <a
        className="carousel-control-prev"
        data-target={props.index}
        role="button"
        data-slide="prev"
        /* onClick={(event) => {
          event.preventDefault();
          //window.location.hash = props.index;
        }} */
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        /* href={props.index} */
        data-target={props.index}
        role="button"
        data-slide="next"
        /*  onClick={(event) => {
          event.preventDefault();
          //window.location.hash = props.index;
        }} */
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
};
export default Carosuel;
