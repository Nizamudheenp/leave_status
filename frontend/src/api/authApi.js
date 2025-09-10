import axios from "axios";

const base = `${import.meta.env.VITE_API_URL}/auth`;

export const loginRequest = (payload) =>
  axios.post(`${base}/login`, payload);

export const registerRequest = (payload) =>
  axios.post(`${base}/register`, payload);
