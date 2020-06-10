import openSocket from "socket.io-client";
import { fetchMessage } from "../user/apiUser";

export default class Notification_Sockets {
  constructor() {
    this.socket = openSocket("http://localhost:5000");
    this.notify = undefined;
  }
  /* 
        Context: Fetch Live Messages
    */
  newMessages = (userId, token) => {
    
  };

  NewFollowers = () => {};
}
