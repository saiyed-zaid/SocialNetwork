export const list = async (isAdmin = false, token = null) => {
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
};

/**
 * For Fetching The Single Post
 *
 * @param {string} postId  Post Id of The Post
 */
export const singlePost = async (postId) => {
  const posts = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
    {
      method: "GET",
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
};

/**
 * for Deleting The USer Post
 *
 * @param {string} userId  User Id Of The User
 * @param {string} token   Token Of Loged In User
 */
export const remove = async (postId, token) => {
  const deletePost = await fetch(
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
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: post,
    }
  );

  return await postData.json();
};

/**
 * Api For like The Post Data In Database
 *
 * @param {string} userId    post Id Of The Logged In User
 * @param {string} token     token Of The Logged In User
 * @param {json} postId        post data
 */
export const like = async (userId, token, postId) => {
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
};

/**
 * Api For unlike The Post Data In Database
 *
 * @param {string} userId   user Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 * @param {json} postId     post Id Of Post To be liked
 */
export const unlike = async (userId, token, postId) => {
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
};

/**
 * Api For comment The Post Data In Database
 *
 * @param {string} userId   user Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 * @param {json} postId     post Id Of Post To be liked
 * @param {string} comment  Comment To Be Send
 */
export const comment = async (userId, token, postId, comment) => {
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
};

/**
 * Api For comment The Post Data In Database
 *
 * @param {string} userId   user Id Of The Logged In User
 * @param {string} token    token Of The Logged In User
 * @param {json} postId     post Id Of Post To be liked
 * @param {string} uncomment  Comment To Be Send
 */
export const uncomment = async (userId, token, postId, comment) => {
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
};
