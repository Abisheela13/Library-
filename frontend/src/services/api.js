import axios from "axios";

const api = axios.create({
  baseURL: "https://library-wkm4.onrender.com/api"
});

export default api;