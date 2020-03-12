export const update = async (userId, token, post) => {
  const userData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/new/${userId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: post
    }
  );

  return await userData.json();
};
