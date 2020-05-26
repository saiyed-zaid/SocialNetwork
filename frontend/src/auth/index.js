/* export const signin = (user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return err;
    });
};
 */
/**
 * Function For Authenticating User
 *
 * @param {Token} jwt
 * @param {function} next
 */
export const authenticate = (jwt, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    next();
  }
};

/**
 * Function For Signin Out User
 *
 * @param {function} next
 */
export const signout = (next) => {
  const token = isAuthenticated().user.token;
  return fetch(`${process.env.REACT_APP_API_URL}/api/signout`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
      }
      next();

      return response.json();
    })
    .catch((err) => console.log(err));
};

/**
 * Function For Checking User Is Authenticated Or Not
 */
export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

/**
 * Api For sending Mail to the email
 *
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  const maildata = await fetch(
    `${process.env.REACT_APP_API_URL}/api/forgot-password/`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );
  return await maildata.json();
};

/**
 * Api For Resetting Or Updating The Password
 *
 * @param {json} resetInfo
 */
export const resetPassword = async (resetInfo) => {
  const resetData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/reset-password/`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetInfo),
    }
  );
  return await resetData.json();
};

/**
 * Login With Google Api
 * @param {} user
 */
export const socialLogin = async (user) => {
  const loginData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/social-login/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  return await loginData.json();
};
