import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;  

export const searchAlbums = (query) =>
  API.get(`/search?query=${encodeURIComponent(query)}`);

export const getCollection = () => API.get("/collection");

export const addToCollection = (album) => API.post("/collection", album);

export const deleteFromCollection = (index) =>
  API.delete(`/collection/${index}`);
