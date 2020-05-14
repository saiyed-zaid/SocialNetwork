import React from "react";

const Alert = (props) => {
  return (
    <div
      style={props.style}
      className={`alert alert-${props.type}`}
      role="alert"
    >
      {props.message}
    </div>
  );
};
export default Alert;
