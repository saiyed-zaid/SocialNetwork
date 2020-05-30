import React from "react";
import Avatar from "./Avatar";
/* const handler = (e) => {
  e.target.parentNode.parentNode.parentNode.classList.replace("show", "hide");
}; */
function Toast(props) {
  return (
    <li className="noti w-100" style={{ height: "50px" }}>
      <img
        src={props.src ? props.src : <Avatar />}
        style={{ width: "30px", height: "30px" }}
        className="rounded-circle bg-dark"
        alt=""
      />

      <strong className="mr-auto">{props.msg}</strong>
      <small>
        &nbsp;&nbsp;
        {props.followedFrom
          ? `${new Date(props.followedFrom).toDateString()}`
          : ""}
      </small>
    </li>
    /* <div
        style={{ position: "absolute" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className={props.status}>
          <div className="toast-header bg-success text-light">
            <img
              src={props.src ? props.src : ""}
              style={{ width: "30px" }}
              className="rounded-circle"
              alt=""
            />

            <strong className="mr-auto">{props.type}</strong>
            <small>
              &nbsp;&nbsp;
              {props.followedFrom
                ? `${new Date(props.followedFrom).toDateString()}`
                : ""}
            </small>
            <button
              type="button"
              className="ml-2 mb-1 close"
              data-dismiss="toast"
              aria-label="Close"
              onClick={handler}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">{props.msg}</div>
        </div>
      </div> */
  );
}
export default Toast;
