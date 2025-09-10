import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import { loginRequest } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginRequest(form);
      dispatch(loginSuccess(res.data));
      toast.success("Logged in");
      nav("/open");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={submit} className="w-[420px] bg-white shadow-xl rounded p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input name="email" onChange={onChange} type="email" placeholder="Email" className="w-full border p-3 rounded mb-3" required />
        <input name="password" onChange={onChange} type="password" placeholder="Password" className="w-full border p-3 rounded mb-4" required />
        <button className="w-full bg-blue-600 text-white py-3 rounded">Login</button>
        <p className="mt-4 text-center text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
  );
}
