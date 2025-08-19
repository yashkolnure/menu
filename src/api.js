import axios from "axios";

const API = axios.create({
  baseURL: "https://menubackend-git-main-yashkolnures-projects.vercel.app/api/agency", // backend url
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
