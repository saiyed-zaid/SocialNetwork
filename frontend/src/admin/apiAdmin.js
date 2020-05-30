import axios from "axios";

export const getNewUsers = async (userId, token) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/newusers/${userId}`,
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
};

export const getNewPosts = async (userId, token) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/post/newpost/${userId}`,
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
};

export const getDailyActiveUsers = async (userId, token) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/onlinetoday/${userId}`,
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
};

export const getUsersOnlineNow = async (userId, token) => {
  const response = await axios(
    `${process.env.REACT_APP_API_URL}/api/user/onlinenow/${userId}`,
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
};
