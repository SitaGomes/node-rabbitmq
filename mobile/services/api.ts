import axios from "axios";

const phoneBaseUrl = "http://192.168.1.24:8080";
const webBaseUrl = "http://localhost:8080";

const api = axios.create({
  baseURL: phoneBaseUrl,
});

export default api;
