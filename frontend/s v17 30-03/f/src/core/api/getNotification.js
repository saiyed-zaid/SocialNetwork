import { isAuthenticated } from "../../auth/index";
/**
 * Api For Reading Data From Database
 *
 * @param {string} userId   User Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 *
 * @returns {json}
 */
//userId, token
export const read = async () => {
  const user = await fetch(
    `${process.env.REACT_APP_API_URL}/api/user/${isAuthenticated().user._id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`
      }
    }
  );

  return await user.json({ user });
};
export const isFollowStatusChange = async () => {
  const userData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/user/newFollowerStatusChange/${isAuthenticated().user._id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${isAuthenticated().user.token}`
      }
    }
  );

  return await userData.json();
};
