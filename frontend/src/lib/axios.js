import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://backend-chat-app-dc62.onrender.com/api",
  withCredentials: true,
});
