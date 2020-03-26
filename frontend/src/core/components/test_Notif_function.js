import React, { useEffect, useState } from "react";
import { read, isFollowStatusChange } from "../api/getNotification";

import Follow from "./getNewFollower";
let hasNewFollow = false;
let timer;

function followStatusChange() {
  if (hasNewFollow) {
    alert("hello");
    isFollowStatusChange();
    const toast = document.querySelectorAll(".toast");
    toast.forEach(t => {
      t.classList.replace("show", "hide");
    });
    clearTimeout(timer);
    console.log(toast);

    hasNewFollow = false;
  }
}

let newFollower = [];
function  Notification(props) {
    /* alert('1'); */
  if (hasNewFollow) {
    timer = setTimeout(followStatusChange, 20000);
  }
  read()
    .then(data => {
      if (data.followers.length > 0) {
        newFollower = new Array(data.followers.length);
        data.followers.forEach((follower, i) => {
          if (follower.isNewUser) {
              console.log('new FOLLOW',follower);
              
            hasNewFollow = true;
            newFollower.push(follower);
          }
        });
        console.log("DATA__", newFollower);
       /* alert('2'); */
      }
      //<Redirect to="/signin" />;
    })
    .catch(err => {
      if (err) {
        console.log("Unauthor______", err);
      }
    });
    /* alert('3'); */
    if(hasNewFollow)
    {

        return <Follow test={newFollower} />;
    }else{
        return <h1>No Follow</h1>;
    }
}

export default Notification;
