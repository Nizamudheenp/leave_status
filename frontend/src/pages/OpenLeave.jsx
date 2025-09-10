import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyLeaves } from "../api/leaveApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OpenLeave() {
  const { user } = useSelector(state => state.auth);
  const nav = useNavigate();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await getMyLeaves(user.token);
        setLeaves(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load leaves");
      }
    };
    fetchLeaves();
  }, [user]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Leave Requests</h1>

        {user.role === 'Employee' && (
          <button onClick={() => nav("/apply")} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            Apply for Leave
          </button>
        )}

        <div>
          {leaves.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map(leave => (
                <div key={leave._id} onClick={() => nav(`/leave/${leave._id}`)} className="cursor-pointer border p-4 rounded hover:bg-gray-50">
                  <h2 className="font-semibold">{leave.employeeId.name}</h2>
                  <p>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                  <p className={`text-sm ${leave.status === 'Approved' ? 'text-green-600' : leave.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                    Status: {leave.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
