import React from "react";

function Toast(props) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{ position: "absolute", bottom: "0", right: "0" }}
    >
      <div className={props.status}>
        <div className="toast-header bg-success text-light">
          <strong className="mr-auto">{props.type}</strong>
          <small>Status</small>
          <button
            type="button"
            className="ml-2 mb-1 close"
            data-dismiss="toast"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="toast-body">{props.msg}</div>
      </div>
    </div>
  );
}
export default Toast;
