import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

export default api;
