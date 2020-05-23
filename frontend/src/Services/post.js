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

  async deletePost(postId, token) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async editPost(post, postId, token) {
    console.log("aaaaaaaaaaaaaa", postId, token);
    const postData = await fetch(
      `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: post,
      }
    );

    return await postData.json();
  }

  async likePost(userId, token, postId) {
    try {
      const postData = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/like`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, postId }),
        }
      );
      return await postData.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async unlikePost(userId, token, postId) {
    try {
      const postData = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/unlike`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, postId }),
        }
      );
      return await postData.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addComment(userId, token, postId, comment) {
    try {
      const commentData = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/comment`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, postId, comment }),
        }
      );
      return await commentData.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async removeComment(userId, token, postId, comment) {
    try {
      const commentData = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/uncomment`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, postId, comment }),
        }
      );
      return await commentData.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async commentReply(userId, token, postId, reply, comment) {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/post/comment/reply`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, postId, reply, comment }),
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async fetchScheduledPosts(userId, token) {
    const posts = await fetch(
      `${process.env.REACT_APP_API_URL}/api/post/schedule/by/${userId}`,
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

  async deleteScheduledPost(postId, token) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/scheculed/post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
