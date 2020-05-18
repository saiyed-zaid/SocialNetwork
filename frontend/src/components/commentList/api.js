export const commentReply = async (userId, token, postId, reply, comment) => {
  const commentData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/post/comment/reply`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, postId, reply, comment }),
    }
  );
};
