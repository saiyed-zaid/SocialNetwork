/**
 * For  Creating Post
 *
 * @param {string} userId  User Id Of the user Who Creates The post
 * @param {string} token   User Login Token
 * @param {} post          Post Data To be Entered In database
 */
export const create = async (userId, token, post) => {
  const postData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/${userId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: post
    }
  );

  return await postData.json();
};

/**
 * For Listing All the Posts
 */
export const list = async () => {
  const posts = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
    method: "GET"
  });
  return await posts.json({ posts });
};

/**
 * For Fetching The Single Post
 *
 * @param {string} postId  Post Id of The Post
 */
export const singlePost = async postId => {
  const posts = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
    {
      method: "GET"
    }
  );
  return await posts.json({ posts });
};

/**
 *  For Listing posts by User Details
 *
 * @param {string} userId  User Id Of The User
 * @param {string} token   Token Of Loged In User
 */
export const listByUser = async (userId, token) => {
  const posts = await fetch(
    `${process.env.REACT_APP_API_URL}/api/posts/by/${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return await posts.json({ posts });
};

/**
 * for Deleting The USer Post
 *
 * @param {string} userId  User Id Of The User
 * @param {string} token   Token Of Loged In User
 */
export const remove = async (userId, token) => {
  const deletePost = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/${userId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return await deletePost.json();
};

/**
 * Api For Updating The Post Data In Database
 *
 * @param {string} userId    post Id Of The Logged In User
 * @param {string} token     token Of The Logged In User
 * @param {json} post        post data
 */
export const update = async (postId, token, post) => {
  const postData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: post
    }
  );

  return await postData.json();
};
