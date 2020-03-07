export const read = async (userId, token) => {
  const user = await fetch(
    `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "Application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );

  return await user.json({ user });
};

export const list = async (userId, token) => {
  const users = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
    method: "GET"
  });
  return await users.json({ users });
};

export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "Applicatiom/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const update = (userId, token, user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: user
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const updateUser = (user, next) => {
  if (typeof window != "undefined") {
    if (localStorage.getItem("jwt").user) {
      let auth = JSON.parse(localStorage.getItem("jwt").user);
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};
