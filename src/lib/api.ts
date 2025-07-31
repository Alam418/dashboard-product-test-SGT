import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api/web/v1",
  timeout: 5000,
});

export default api;
