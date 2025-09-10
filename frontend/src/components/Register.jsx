import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../features/authSlice";
import { registerRequest } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", role: "Employee", email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerRequest(form);
      dispatch(registerSuccess(res.data));
      toast.success("Registered");
      nav("/open");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={submit} className="w-[420px] bg-white shadow-xl rounded p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input name="name" onChange={onChange} placeholder="Name" className="w-full border p-3 rounded mb-3" required />
        <select name="role" onChange={onChange} className="w-full border p-3 rounded mb-3">
          <option>Employee</option>
          <option>Team Lead</option>
          <option>Project Lead</option>
          <option>HR</option>
          <option>CEO</option>
        </select>
        <input name="email" onChange={onChange} type="email" placeholder="Email" className="w-full border p-3 rounded mb-3" required />
        <input name="password" onChange={onChange} type="password" placeholder="Password" className="w-full border p-3 rounded mb-4" required />
        <button className="w-full bg-green-600 text-white py-3 rounded">Register</button>
        <p className="mt-4 text-center text-sm">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}
