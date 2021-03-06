import axios from "axios";

export const createHeaders = jwt => {
  let headers = {};
  headers.Authorization = "Bearer " + jwt;
  return { headers };
};

export const getAllPosts = async () => {
  const jwt = sessionStorage.getItem("jwt");
  const currentUser = sessionStorage.getItem("username");
  const headers = createHeaders(jwt);
  const response = await axios.get(
    process.env.REACT_APP_URL + "/posts/" + currentUser,
    headers
  );
  return response.data;
};

export const userLogin = async (username, password) => {
  const requestBody = {
    username,
    password
  };
  const response = await axios.post(
    process.env.REACT_APP_URL + "/login",
    requestBody
  );
  return response.data;
};

export const isUserAuthorised = async () => {
  const jwt = sessionStorage.getItem("jwt");
  const currentUser = sessionStorage.getItem("username");
  if (jwt && currentUser) {
    const headers = createHeaders(jwt);
    const url = process.env.REACT_APP_URL + "/secure/" + currentUser;
    const response = await axios.get(url, headers);
    if (response.ok) {
      sessionStorage.setItem("username", response.data.username);
      return { headers, currentUser };
    }
  }
  return false;
};

export const createPost = async (title, content, jwt, username) => {
  const requestBody = {
    postTitle: title,
    postBody: content
  };
  const headers = createHeaders(jwt);
  await axios.post(
    `${process.env.REACT_APP_URL}/posts/${username}`,
    requestBody,
    headers
  );
};

export const updatePost = async (
  postId,
  postTitle,
  postBody,
  createdOn,
  jwt,
  username
) => {
  const headers = createHeaders(jwt);
  const requestBody = {
    postId,
    postTitle,
    postBody,
    createdOn
  };
  await axios.put(
    `${process.env.REACT_APP_URL}/posts/${username}`,
    requestBody,
    headers
  );
};

export const deletePost = async (postId, jwt, username) => {
  const headers = createHeaders(jwt);
  await axios.delete(
    `${process.env.REACT_APP_URL}/posts/${username}/${postId}`,
    headers
  );
};
