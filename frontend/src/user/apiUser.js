/**
 * Api For Reading Data From Database
 *
 * @param {string} userId   User Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 *
 * @returns {json}
 */
export const read = async (userId, token) => {
  const user = await fetch(
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

  return await user.json({ user });
};

/**
 * Api for Listing All The Users
 *
 * @returns {json}
 */
export const list = async () => {
  const users = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
    method: "GET",
  });
  return await users.json({ users });
};

/**
 * Api For Deleting The User Profile
 *
 * @param {string} userId         User Id Of The Logged In User
 * @param {string} tokentoken     Of The Logged In User
 */
export const remove = async (userId, token) => {
  const deleteUser = await fetch(
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
  return await deleteUser.json();
};

/**
 * Api For Updating The UserData In Database
 *
 * @param {string} userId    User Id Of The Logged In User
 * @param {string} token     token Of The Logged In User
 * @param {json} user        User data
 */
export const update = async (userId, token, user) => {
  const userData = await fetch(
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

  return await userData.json();
};

/**
 * Api for Updating The User Data In Browser Localstorage
 *
 * @param {json} user       user Data
 * @param {function} next  Function To be Executed After Updating Data
 */
export const updateUser = (user, next) => {
  if (typeof window != "undefined") {
    if (JSON.parse(localStorage.getItem("jwt")).user) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = { token: auth.user.token, ...user };
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};

/**
 * Api to Follow Peoples
 *
 * @param  {string}  userId
 * @param  {string}  token
 * @param  {string}  followId
 */
export const follow = async (userId, token, followId) => {
  const userData = await fetch(
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

  return await userData.json();
};

/**
 * Api to unFollow Peoples
 *
 * @param  {string}  userId
 * @param  {string}  token
 * @param  {string}  followId
 */
export const unfollow = async (userId, token, unfollowId) => {
  const userData = await fetch(
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

  return await userData.json();
};

/**
 * Api For Fetching New User Except Our Following
 *
 * @param {string} userId
 * @param {string} token
 */
export const findPeople = async (userId, token) => {
  const user = await fetch(
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

  return await user.json();
};

/**
 * Api For Fetching messages for user
 *
 * @param {string} userId   User Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 *
 * @returns {json}
 */
export const fetchMessage = async (senderId, receiverId, token) => {
  const messages = await fetch(
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

  return await messages.json({ messages });
};

export const getOnlineUsers = async (userId, token) => {
  const onlineUsers = await fetch(
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

  return await onlineUsers.json({ onlineUsers });
};
