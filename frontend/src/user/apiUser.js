export const read = async (userId, token) => {
  console.log("TOKEN__", token);
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

  /*   return  fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
    method: "GET"
  })
    .then(response => {
      console.log('FRONt REPOS__',response);
      return await response.json();
    })
    .catch(err => console.log(err));
 */
};

export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "applicayion/json",
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
    method: "PUT",
    headers: {
      Accept: "applicayion/json",
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
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;
      localStorage.setItem("jwt", JSON.stringify(auth));
      next();
    }
  }
};
