import React, { Component } from "react";
import { validateAll } from "indicative/validator";
import axios from "axios";
export default class user extends Component {
  /**
   * Api For Reading Data From Database
   *
   * @param {string} userId   User Id Of The Logged In User
   * @param {string} token    token Of The Logged In User
   *
   * @returns {json}
   */
  async read(userId, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  }

  /**
   * Api for Listing All The Users
   *
   * @returns {json}
   */
  async list(token) {
    const response = await axios(`${process.env.REACT_APP_API_URL}/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  /**
   * Api For Deleting The User Profile
   *
   * @param {string} userId         User Id Of The Logged In User
   * @param {string} tokentoken     Of The Logged In User
   */
  async remove(userId, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }

  /**
   * Api For Updating The UserData In Database
   *
   * @param {string} userId    User Id Of The Logged In User
   * @param {string} token     token Of The Logged In User
   * @param {json} user        User data
   */
  async update(userId, token, user) {
    const fieldData = {};
    const rules = {};

    for (const iterator of user.keys()) {
      /*  alert("value " + user.get(iterator));
      alert("key " + iterator); */

      fieldData[iterator] = user.get(iterator);
      rules[iterator] = "required";
    }

    /*  const rules = {
      name: "required",
      email: "required|email",
    }; */

    const messages = {
      required: "{{field}} Field is Required.",
    };

    try {
      await validateAll(fieldData, rules, messages);

      const response = await axios(
        `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: user,
        }
      );

      if (response.err) {
        return Promise.reject(response.err);
      } else {
        return response;
      }
    } catch (errors) {
      var formattedErrors = {};
      errors.forEach((error) => {
        formattedErrors[error.field] = error.message;
      });
      return Promise.reject(formattedErrors);
    }
  }

  /**
   * Api for Updating The User Data In Browser Localstorage
   *
   * @param {json} user       user Data
   * @param {function} next  Function To be Executed After Updating Data
   */
  async updateUser(user, next) {
    if (typeof window != "undefined") {
      if (JSON.parse(localStorage.getItem("jwt")).user) {
        let auth = JSON.parse(localStorage.getItem("jwt"));
        auth.user = { token: auth.user.token, ...user };
        localStorage.setItem("jwt", JSON.stringify(auth));
        next();
      }
    }
  }

  /**
   * Api to Follow Peoples
   *
   * @param  {string}  userId
   * @param  {string}  token
   * @param  {string}  followId
   */
  async follow(userId, token, followId) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/follow/${userId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, followId }),
      }
    );

    return response;
  }

  /**
   * Api to unFollow Peoples
   *
   * @param  {string}  userId
   * @param  {string}  token
   * @param  {string}  followId
   */
  async unfollow(userId, token, unfollowId) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/unfollow/${userId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, unfollowId }),
      }
    );

    return response;
  }

  /**
   * Api For Fetching New User Except Our Following
   *
   * @param {string} userId
   * @param {string} token
   */
  async findPeople(userId, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/findpeople/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  }

  /**
   * Api For Fetching messages for user
   *
   * @param {string} userId   User Id Of The Logged In User
   * @param {string} token    token Of The Logged In User
   *
   * @returns {json}
   */
  async fetchMessage(senderId, receiverId, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/messages`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: senderId,
          receiver: receiverId,
        }),
      }
    );

    return response;
  }

  /**
   * Api for getting Online USers
   * @param {*} userId
   * @param {*} token
   */
  async getOnlineUsers(userId, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/user/getonline/${userId}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  }
}
