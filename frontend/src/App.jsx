import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import OpenLeave from "./pages/OpenLeave";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Navigate to="/open" replace />} />
      <Route path="/open" element={
        <ProtectedRoute><OpenLeave/></ProtectedRoute>
      } />

      <Route path="/apply" element={
        <ProtectedRoute><ApplyLeave/></ProtectedRoute>
      } />

      <Route path="/leave/:id" element={
        <ProtectedRoute><Dashboard/></ProtectedRoute>
      } />

      <Route path="*" element={<div className="p-8">Not Found</div>} />
    </Routes>
  );
}
