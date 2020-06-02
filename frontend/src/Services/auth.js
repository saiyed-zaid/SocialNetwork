import { validateAll } from "indicative/validator";
import { isAuthenticated } from "../auth/index";
import axios from "axios";

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

      const response = await axios(
        `${process.env.REACT_APP_API_URL}/api/signin`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );
      return response;
    } catch (errors) {
      if (errors.response && errors.response.status === 422) {
        //SERVER ERRORS
        return {
          statusCode: errors.response.status,
          msg: errors.response.data.error,
        };
      } else {
        //VALIDATION ERRORS
        var formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.field] = error.message;
        });

        return Promise.reject(formattedErrors);
      }
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

    try {
      await validateAll(data, rules, messages);

      var user = {
        name: data.name,
        email: data.email,
        password: data.password,
        dob: data.dob /*  new Date(data.year, data.month - 1, data.day + 1), */,
      };

      const response = await axios(
        `${process.env.REACT_APP_API_URL}/api/signup`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          data: JSON.stringify(user),
        }
      );

      return response;
    } catch (errors) {
      if (errors.response && errors.response.status !== 200) {
        //SERVER ERRORS

        return {
          statusCode: errors.response.status,
          msg: errors.response.data.msg,
        };
      } else {
        var formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.field] = error.message;
        });

        return Promise.reject(formattedErrors);
      }
    }
  }

  /**
   * APi for Siging Out User
   *
   * @param {function} next
   */
  async signout(next) {
    const token = isAuthenticated().user.token;
    return axios(`${process.env.REACT_APP_API_URL}/api/signout`, {
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

        return response;
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

      const response = await axios(
        `${process.env.REACT_APP_API_URL}/api/changePassword`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: JSON.stringify(formData),
        }
      );
      return response;
    } catch (errors) {
      //console.log(data);
      if (errors.response && errors.response.status !== 200) {
        //SERVER ERRORS

        return {
          statusCode: errors.response.status,
          msg: errors.response.data.message,
        };
      } else {
        var formattedErrors = {};
        errors.forEach((error) => {
          formattedErrors[error.field] = error.message;
        });

        return Promise.reject(formattedErrors);
      }
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
    const resetData = await axios(
      `${process.env.REACT_APP_API_URL}/api/reset-password/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(resetInfo),
      }
    );
    return resetData;
  }

  /**
   * Login With Google Api
   * @param {} user
   */
  async socialLogin(user) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/social-login/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(user),
      }
    );
    return response;
  }
}
