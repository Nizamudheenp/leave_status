import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLeave, approveLeave, rejectLeave } from "../api/leaveApi";
import { toast } from "react-toastify";

const steps = ["Employee", "Team Lead", "Project Lead", "HR", "CEO"];
const NODE_POS = {
  Employee: { x: 100, y: 90 },
  "Team Lead": { x: 300, y: 160 },
  "Project Lead": { x: 500, y: 60 },
  HR: { x: 700, y: 180 },
  CEO: { x: 920, y: 80 },
};

function Avatar({ src, alt, status }) {
  const base = "w-16 h-16 rounded-full border-4 border-white object-cover";
  const classes =
    status === "approved"
      ? `${base} avatar-glow node-shadow`
      : status === "current"
      ? `${base} avatar-active node-shadow`
      : `${base} node-shadow`;
  return <img src={src} alt={alt} className={classes} onError={(e)=> e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=eeeeee&color=111111`} />;
}

export default function Dashboard(){
  const { id } = useParams();
  const { user } = useSelector(s => s.auth);
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const fetch = async () => {
      try {
        const res = await getLeave(id, user.token);
        setLeave(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load leave");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, user]);




  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!leave) return <div className="min-h-screen flex items-center justify-center text-red-500">Leave not found.</div>;

  const approvedRoles = (leave.approvalFlow || []).filter(s=>s.status === 'Approved').map(s => s.approver.role);
  const currentRole = leave.currentApprover ? leave.currentApprover.role : null;
  const isCurrentApprover = (user && currentRole && user.role === currentRole && leave.status === "Pending");

  const avatarFor = (role) => {
    if (role === leave.employeeId.role || (leave.employeeId && role === "Employee")) {
      return leave.employeeId.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(leave.employeeId.name)}&background=ffffff&color=111`;
    }
    const flowEntry = (leave.approvalFlow || []).find(f => f.approver && f.approver.role === role);
    if (flowEntry && flowEntry.approver && flowEntry.approver.profileImage) return flowEntry.approver.profileImage;
    if (leave.currentApprover && leave.currentApprover.role === role && leave.currentApprover.profileImage) return leave.currentApprover.profileImage;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(role)}&background=ffffff&color=111`;
  };

  const handleApprove = async () => {
    if (!isCurrentApprover) return;
    setProcessing(true);
    try {
      const res = await approveLeave(leave._id, user.token);
      setLeave(res.data.leave);
      toast.success(res.data.message || "Approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!isCurrentApprover) return;
    setProcessing(true);
    try {
      const res = await rejectLeave(leave._id, user.token);
      setLeave(res.data.leave);
      toast.error(res.data.message || "Rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
    } finally {
      setProcessing(false);
    }
  };

  const segmentStatus = (fromRole) => {
    return approvedRoles.includes(fromRole) ? "approved" : "pending";
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Leave Status</h1>

        <div className="relative bg-white rounded p-8 shadow-sm" style={{height: 340}}>
          <svg viewBox="0 0 1000 260" className="w-full h-full">
            <path d="M100 90 C180 110 220 110 300 160"
              stroke={segmentStatus("Employee")==="approved" ? "#10B981" : "#9CA3AF"}
              strokeWidth="4"
              strokeDasharray="10 8"
              fill="none" strokeLinecap="round" />
            <path d="M300 160 C380 200 420 120 500 60"
              stroke={segmentStatus("Team Lead")==="approved" ? "#10B981" : "#9CA3AF"}
              strokeWidth="4"
              strokeDasharray="10 8"
              fill="none" strokeLinecap="round" />
            <path d="M500 60 C580 10 620 160 700 180"
              stroke={segmentStatus("Project Lead")==="approved" ? "#10B981" : "#9CA3AF"}
              strokeWidth="4"
              strokeDasharray="10 8"
              fill="none" strokeLinecap="round" />
            <path d="M700 180 C780 210 840 140 920 80"
              stroke={segmentStatus("HR")==="approved" ? "#10B981" : "#9CA3AF"}
              strokeWidth="4"
              strokeDasharray="10 8"
              fill="none" strokeLinecap="round" />
          </svg>

          {steps.map((role) => {
            const pos = NODE_POS[role];
            const approved = approvedRoles.includes(role);
            const current = currentRole === role;
            const status = approved ? "approved" : current ? "current" : "upcoming";
            const avatar = avatarFor(role);
            return (
              <div key={role} style={{position:'absolute', left: `${pos.x - 40}px`, top: `${pos.y - 40}px`, width: 80, textAlign: 'center'}}>
                <div className="flex justify-center mb-2">
                  <div className={`rounded-full w-20 h-20 border-4 border-white ${approved ? 'avatar-glow' : current ? 'avatar-active' : ''} node-shadow`} style={{overflow:'hidden'}}>
                    <Avatar src={avatar} alt={role} status={status} />
                  </div>
                </div>
                <div className="text-center mt-2 text-sm">{role}</div>
              </div>
            );
          })}
        </div>

        {user.role !== "Employee" && isCurrentApprover && (
          <div className="flex justify-center mt-6 gap-4">
            <button onClick={handleApprove} disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              Approve
            </button>
            <button onClick={handleReject} disabled={processing} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50">
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
