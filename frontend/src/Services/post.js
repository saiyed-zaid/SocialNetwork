import { validateAll } from "indicative/validator";

export default class Postservice {
  async addPost(formData, data, userId, token) {
    const rules = {
      title: "required|string|max:120|min:5",
      body: "required|string|max:2000",
    };

    const messages = {
      required: "{{field}} field is required",
    };

    try {
      await validateAll(data, rules, messages);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/post/${userId}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.errors) {
          const formattedErrors = {};
          response.errors.forEach((error) => {
            if (!formattedErrors.hasOwnProperty(error.param)) {
              formattedErrors[error.param] = error.msg;
            }
          });
          return Promise.reject(formattedErrors);
        } else {
          return await response.json();
        }
      } catch (errors) {
        //SERVER ERROR
        return Promise.reject(errors);
      }
    } catch (errors) {
      var formattedErrors = {};
      errors.forEach((error) => {
        formattedErrors[error.field] = error.message;
      });

      return Promise.reject(formattedErrors);
    }
  }

  async fetchPosts(isAdmin = false, token = null) {
    var url = `${process.env.REACT_APP_API_URL}/api/posts`;
    if (isAdmin && token) {
      url = `${process.env.REACT_APP_API_URL}/api/admin/posts`;
    }

    const posts = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await posts.json({ posts });
  }

  async fetchPost(postId) {
    var post;
    try {
      post = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
        {
          method: "GET",
        }
      );
      console.log(post);
      return await post.json({ post });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async fetchPostsByUser(userId, token) {
    const posts = await fetch(
      `${process.env.REACT_APP_API_URL}/api/post/by/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await posts.json({ posts });
  }
}
