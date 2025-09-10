import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL}/leaves`;

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getLeave = (id, token) =>
  axios.get(`${BASE}/${id}`, authHeader(token));

export const getMyLeaves = (token) =>
    axios.get(`${BASE}/`, authHeader(token));


export const applyLeave = (data, token) =>
  axios.post(`${BASE}/`, data, authHeader(token));

/* IMPORTANT: server uses req.user (authMiddleware). DO NOT send approverId */
export const approveLeave = (id, token) =>
  axios.put(`${BASE}/${id}/approve`, {}, authHeader(token));

export const rejectLeave = (id, token) =>
  axios.put(`${BASE}/${id}/reject`, {}, authHeader(token));
