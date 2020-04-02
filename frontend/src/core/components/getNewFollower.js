import React from "react";
import Toast from "../../components/Toast";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        bottom: "0",
        right: "0",
        zIndex: "111"
      }}
    >
      {props.test.map(element => {
        return (
          <div>
            <Toast
              status="toast fade show m-2"
              type="New Follower"
              msg={element.user.name + " Started following you."}
              src={
                element.user.photo
                  ? `${process.env.REACT_APP_API_URL +
                      "/" +
                      element.user.photo.path}`
                  : ""
              }
              followedFrom={element.followedFrom}
            />
          </div>
        );
      })}
    </div>
  );
}
export default Follow;
