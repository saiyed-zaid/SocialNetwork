import { validateAll } from "indicative/validator";
import { isAuthenticated } from "../auth/index";

export default class Authservice {
  /**
   * APi for logging in user
   *
   * @param {json} data USer Data
   */
  async loginUser(data) {
    const rules = {
      email: "required|email|string",
      password: "required|string",
    };

    const messages = {
      required: "{{field}} field is required.",
      "email.email": "Enter a Valid Email.",
    };

    try {
      await validateAll(data, rules, messages);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/signin`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
          }
        ).then((result) => {
          return result.json().then((result) => {
            return result;
          });
        });

        if (response.error) {
          return Promise.reject({
            responseError: response.error,
          });
        } else {
          return response;
        }
      } catch (error) {
        return Promise.reject(error);
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
   * Api for registring User
   *
   * @param {json} data  user data
   */
  async registerUser(data) {
    const rules = {
      name: "required|alpha",
      email: "required|email|string",
      password: "required|string|confirmed|min:5",
      password_confirmation: "required|string",
    };

    const messages = {
      required: "{{field}} Field is Required.",
      "email.email": "Enter a Valid Email.",
      "password.confirmed": "Password Does Not Matched.",
    };

    console.log("bday", new Date(data.year, data.month - 1, data.day));

    try {
      await validateAll(data, rules, messages);

      var user = {
        name: data.name,
        email: data.email,
        password: data.password,
        dob: data.dob /*  new Date(data.year, data.month - 1, data.day + 1), */,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/signup`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (response.err) {
          return Promise.reject(response.err);
        } else {
          return await response.json();
        }
      } catch (error) {
        return Promise.reject(error);
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
   * APi for Siging Out User
   *
   * @param {function} next
   */
  async signout(next) {
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
  }

  /**
   * APi for Changing Password Of the User
   *
   * @param {json} data Password data
   * @param {Token} token authentication token
   */
  async changePassword(data, token) {
    const rules = {
      oldPassword: "required|string",
      password: "required|string|confirmed|min:6",
      password_confirmation: "required|string",
    };

    const messages = {
      required: "{{field}} Field is Required.",
      "password.confirmed": "Password Does Not Matched.",
    };

    try {
      await validateAll(data, rules, messages);

      var formData = {
        oldPassword: data.oldPassword,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/changePassword`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );
        return await response.json();
      } catch (error) {
        console.log(error);
      }
    } catch (errors) {
      //console.log(data);

      var formattedErrors = {};
      errors.forEach((error) => {
        formattedErrors[error.field] = error.message;
      });

      return Promise.reject(formattedErrors);
    }
  }

  /**
   * Function For Authenticating User
   *
   * @param {Token} jwt
   * @param {function} next
   */
  async authenticate(jwt, next) {
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", JSON.stringify(jwt));
      next();
    }
  }
  /**
   * Api For Resetting Or Updating The Password
   *
   * @param {json} resetInfo
   */
  async resetPassword(resetInfo) {
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
  }

  /**
   * Login With Google Api
   * @param {} user
   */
  async socialLogin(user) {
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
  }
}
