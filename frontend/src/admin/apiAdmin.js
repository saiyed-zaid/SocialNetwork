export const getNewUsers = async (userId, token) => {
  const newUsers = await fetch(
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

  return await newUsers.json({ newUsers });
};

export const getNewPosts = async (userId, token) => {
  const newPosts = await fetch(
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

  return await newPosts.json({ newPosts });
};

export const getDailyActiveUsers = async (userId, token) => {
  const activeUsers = await fetch(
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

  return await activeUsers.json({ activeUsers });
};

export const getUsersOnlineNow = async (userId, token) => {
  const activeUsers = await fetch(
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

  return await activeUsers.json({ activeUsers });
};
