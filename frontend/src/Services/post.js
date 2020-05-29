import { validateAll } from "indicative/validator";

export default class Postservice {
  /**
   * APi For Creating Post
   * @param {*} formData Data to Add TO the Post
   * @param {*} data  Data For validation
   * @param {*} userId USers User ID
   * @param {*} token Auhtentication token
   */
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
  /** Api for Fetching All  Posts
   *
   * @param {*} isAdmin  Check Role OF the USer
   * @param {*} token Authentication Token
   */
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
  /**
   * Fetch SIngle Post by post id
   *
   * @param {*} postId Post Id to Fetch
   */
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

  /**
   * APi For Fetching Post  By Their USer ID
   * @param {*} userId  USers IserID
   * @param {*} token  Authectication Token
   */
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
  /**
   * Api for Delteing post by postid
   *
   * @param {*} postId Post ID TO Delete
   * @param {*} token  Token For USer Authentication
   */
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

  /**
   * Api Forediting The post data
   *
   * @param {*} post Edited POSt data
   * @param {*} postId  POst Id of post which is edited
   * @param {*} token Authentication token
   */
  async editPost(data, post, postId, token) {
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
  /**
   *
   * @param {*} userId  USer ID of User Who Likes POst
   * @param {*} token authentication token for user
   * @param {*} postId  postid which post is liked
   */
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

  /**
   * Api for Liking THe post
   *
   * @param {*} userId  User Id og use rwho unlikes post
   * @param {*} token user authentication token
   * @param {*} postId post Id of post Which is unliked
   */
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

  /**
   * Api for adding Comment TO the Post
   *
   * @param {*} userId User ID of User Who Adds Comment
   * @param {*} token Token Of For Authentication
   * @param {*} postId Postid on which user adding comment
   * @param {*} comment comment text
   */
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

  /**
   * Api for Removing Coometn from the post
   *
   * @param {*} userId  User id of the user WHo commented
   * @param {*} token token for authentication
   * @param {*} postId post id of the post where post added
   * @param {*} comment comment text
   */
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
  /**
   * Api for Adding Reply to the comment
   *
   * @param {*} userId Userid Of the user
   * @param {*} token token for authentication
   * @param {*} postId postid of the psot on which user adding reply
   * @param {*} reply  reply text
   * @param {*} comment comment id
   */

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
  /**
   * Api for fetching scheduled Posts for loggedin user
   *
   * @param {*} userId  Userid of the post creater
   * @param {*} token Token for authentication
   */
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

  /**
   * Api for Deleteing Scheduled POst by post id
   *
   * @param {*} postId post id of the post which is deleteing
   * @param {*} token token for authentication
   */
  async deleteScheduledPost(postId, token) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/schedule/${postId}`,
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

  /**api for fetching scheduled post by post id
   *
   * @param {*} postId post id which post user needs to fetch
   */
  async fetchScheduledPost(postId) {
    var post;
    try {
      post = await fetch(
        `${process.env.REACT_APP_API_URL}/api/post/schedule/edit/${postId}`,
        {
          method: "GET",
        }
      );
      return await post.json({ post });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Api for editing Scheduled Post
   *
   * @param {*} data  Data  For Validation
   * @param {*} post  Post data to edit
   * @param {*} postId post id to edit
   * @param {*} token token for authentication
   */
  async editScheduledPost(data, post, postId, token) {
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
          `${process.env.REACT_APP_API_URL}/api/post/schedule/${postId}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: post,
          }
        );

        // return await postData.json();

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
}
