import React from "react";

const handler = e => {
  e.target.parentNode.parentNode.parentNode.classList.replace("show", "hide");
};

function Follow(props) {
  if (props.test) {
    if (props.test.length === 0) {
      return <span></span>;
    }
  }
  return (
    <div style={{ position: "fixed", bottom: "0", right: "0" }}>
      {props.test.map(element => {
        return (
          <div>
            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className="toast fade show m-2"
              data-autohide="false"
            >
              <div className="toast-header text-primary">
                <img
                  style={{ width: "30px" }}
                  src={
                    element.user.photo
                      ? `${process.env.REACT_APP_API_URL +
                          "/" +
                          element.user.photo.path}`
                      : ""
                  }
                  className="rounded mr-2"
                  alt="..."
                />
                <strong className="mr-auto">New Follower</strong>
                <small>
                  &nbsp;{`${new Date(element.followedFrom).toDateString()}`}
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
              <div className="toast-body">
                <b>{element.user.name}</b> Started following you
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Follow;
