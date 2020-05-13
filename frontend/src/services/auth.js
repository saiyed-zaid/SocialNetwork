import { validateAll } from "indicative/validator";
import { isAuthenticated } from "../auth/index";

export default class Authservice {
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
        );

        if (response.error) {
          return Promise.reject(response.error);
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

  signout(next) {
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
}
