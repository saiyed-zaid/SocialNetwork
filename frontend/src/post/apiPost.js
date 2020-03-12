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

export const list = async () => {
  const posts = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
    method: "GET"
  });
  return await posts.json({ posts });
};

export const singlePost = async postId => {
  const posts = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/${postId}`,
    {
      method: "GET"
    }
  );
  return await posts.json({ posts });
};

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
