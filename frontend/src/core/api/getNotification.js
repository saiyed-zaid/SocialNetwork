import { isAuthenticated } from "../../auth/index";
import axios from "axios";
/**
 * Api For Reading Data From Database
 *
 * @param {string} userId   User Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 *
 * @returns {json}
 */

export const newFollowersList = async () => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/newFollowers/user/${
      isAuthenticated().user._id
    }`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
    }
  );

  return response;
};

export const isFollowStatusChange = async (followerId) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/newFollowerStatusChange/${
      isAuthenticated().user._id
    }`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
      data: { followerId },
    }
  );

  return response;
};

export const isLikesStatusChange = async (postId, likeId) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/newLikesStatusChange/${
      isAuthenticated().user._id
    }`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
      data: { postId, likeId },
    }
  );

  return response;
};
export const isCommentStatusChange = async (postId, commenterId) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/newCommentStatusChange/${
      isAuthenticated().user._id
    }`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
      data: { postId, commenterId },
    }
  );

  return response;
};

export const readPost = async () => {
  const posts = await axios(
    `${process.env.REACT_APP_API_URL}/api/new/likeComments/post/by/${
      isAuthenticated().user._id
    }`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
    }
  );
  return posts;
};

/**
 * Api For Reading Data From Database
 *
 * @param {string} userId   User Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 *
 * @returns {json}
 */
//userId, token
export const fetchNewMessage = async () => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/messages/${
      isAuthenticated().user._id
    }`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
    }
  );

  return response;
};

export const messageStatusChange = async () => {
  const userData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/user/messageStatusChange/${
      isAuthenticated().user._id
    }`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`,
      },
    }
  );

  return await userData.json();
};
