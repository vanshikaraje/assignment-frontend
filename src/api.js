import axios from "axios";

const API = axios.create({
  baseURL: "https://assignment-backend-sand.vercel.app/api",
});

export default API;
