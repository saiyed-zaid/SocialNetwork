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
        Authorization: `Bearer ${token}`
      }
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
    method: "GET"
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
        Authorization: `Bearer ${token}`
      }
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
        Authorization: `Bearer ${token}`
      },
      body: user
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
