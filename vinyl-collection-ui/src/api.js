import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for potential error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized request. Token might be expired.");
    }
    return Promise.reject(error);
  }
);


export default apiClient;

// Specific API functions
export const searchAlbums = (query) => {
  return apiClient.get('/search', { params: { query } });
};

export const getCollection = () => {
  return apiClient.get('/collection');
};

export const addToCollection = (album) => {
  return apiClient.post('/collection', album);
};

export const deleteFromCollection = (index) => {
  return apiClient.delete(`/collection/${index}`);
};

export const updateCondition = (albumId, condition) => {
  return apiClient.patch(`/collection/${albumId}/condition`, null, { params: { condition } });
};