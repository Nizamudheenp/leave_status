import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLeave, approveLeave, rejectLeave } from "../api/leaveApi";
import { toast } from "react-toastify";


const steps = ["Employee", "Team Lead", "Project Lead", "HR", "CEO"];
const NODE_POS = {
  Employee: { x: 80, y: 100 },
  "Team Lead": { x: 260, y: 160 },
  "Project Lead": { x: 480, y: 60 },
  HR: { x: 700, y: 180 },
  CEO: { x: 920, y: 100 },
};

function Avatar({ src, alt, status }) {
  const base = "w-full h-full object-cover transition-all duration-300";
  const classes =
    status === "approved"
      ? `${base}`
      : status === "current"
        ? `${base}`
        : `${base}`;
  return (
    <img
      src={src}
      alt={alt}
      className={classes}
      onError={(e) =>
        (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=eeeeee&color=111111`)
      }
    />
  );
}


export default function Dashboard() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [animatingRole, setAnimatingRole] = useState(null);


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
    };
    fetch();
  }, [id, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!leave) return <div className="min-h-screen flex items-center justify-center text-red-500">Leave not found.</div>;

  const approvedRoles = (leave.approvalFlow || []).filter(s => s.status === 'Approved').map(s => s.approver.role);
  const currentRole = leave.currentApprover ? leave.currentApprover.role : null;
  const isCurrentApprover = (user && currentRole && user.role === currentRole && leave.status === "Pending");

  // avatar from backend 

  // const avatarFor = (role) => {
  //   if (role === leave.employeeId.role || (leave.employeeId && role === "Employee")) {
  //     return leave.employeeId.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(leave.employeeId.name)}&background=ffffff&color=111111`;
  //   }
  //   const flowEntry = (leave.approvalFlow || []).find(f => f.approver && f.approver.role === role);
  //   if (flowEntry && flowEntry.approver && flowEntry.approver.profileImage) return flowEntry.approver.profileImage;
  //   if (leave.currentApprover && leave.currentApprover.role === role && leave.currentApprover.profileImage) return leave.currentApprover.profileImage;
  //   return `https://ui-avatars.com/api/?name=${encodeURIComponent(role)}&background=ffffff&color=111111`;
  // };

  const avatarFor = (role) => {
    const roleImages = {
      "Employee": "/images/ceo.png",
      "Team Lead": "/images/hr.png",
      "Project Lead": "/images/projectlead.png",
      "HR": "/images/hr.png",
      "CEO": "/images/ceo.png"
    };

    if (role === leave.employeeId.role || (leave.employeeId && role === "Employee")) {
      return roleImages["Employee"];
    }
    if (roleImages[role]) {
      return roleImages[role];
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(role)}&background=ffffff&color=111111`;
  };


  const handleApprove = async () => {
    if (!isCurrentApprover) return;
    setProcessing(true);
    try {
      const res = await approveLeave(leave._id, user.token);
      toast.success(res.data.message || "Approved");
      setAnimatingRole(currentRole);
      const updatedLeave = await getLeave(leave._id, user.token);
      setLeave(updatedLeave.data);

      setTimeout(() => {
        setAnimatingRole(null);
      }, 1000);
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
      toast.error(res.data.message || "Rejected");
      const updatedLeave = await getLeave(leave._id, user.token);
      setLeave(updatedLeave.data);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl text-[#4D4D4D] border-b-2 border-[#43C8FF] pb-5 mb-4">Leave Status</h1>

        <div className="relative bg-white rounded-lg p-8" style={{ height: 340 }}>
          <svg viewBox="0 0 1000 260" className="w-full h-full">
            <path d="M60 85 C110 350 160 130 200 140"
              stroke={
                segmentStatus("Employee") === "approved" || animatingRole === "Employee"
                  ? "#31ED31"
                  : "#3f3f43dc"
              } strokeWidth="3"
              strokeDasharray="6 8"
              fill="none" strokeLinecap="round"
              style={{
                transition: "stroke 2s ease-in-out"
              }} />
            <path d="M250 100 C260 100 250 40 400 25"
              stroke={segmentStatus("Team Lead") === "approved" || animatingRole === "Team Lead"
                ? "#31ED31"
                : "#3f3f43dc"}
              strokeWidth="3"
              strokeDasharray="6 8"
              fill="none" strokeLinecap="round"
              style={{
                transition: "stroke 2s ease-in-out"
              }} />
            <path d="M460 25 C550 10 420 190 610 135"
              stroke={segmentStatus("Project Lead") === "approved" || animatingRole === "Project Lead"
                ? "#31ED31"
                : "#3f3f43dc"}
              strokeWidth="3"
              strokeDasharray="6 8"
              fill="none" strokeLinecap="round"
              style={{
                transition: "stroke 2s ease-in-out"
              }} />
            <path d="M670 150 C780 250 750 110 830 75"
              stroke={segmentStatus("HR") === "approved" || animatingRole === "HR"
                ? "#31ED31"
                : "#3f3f43dc"}
              strokeWidth="3"
              strokeDasharray="6 8"
              fill="none" strokeLinecap="round"
              style={{
                transition: "stroke 2s ease-in-out"
              }} />
          </svg>

          {steps.map((role) => {
            const pos = NODE_POS[role];
            const approved = approvedRoles.includes(role);
            const current = currentRole === role;
            const status = approved ? "approved" : current ? "current" : "upcoming";
            const avatar = avatarFor(role);
            return (
              <div key={role} style={{ position: 'absolute', left: `${pos.x - 40}px`, top: `${pos.y - 40}px`, width: 80, textAlign: 'center' }}>
                <div className="flex justify-center mb-2">
                  <div className={`rounded-full w-16 h-16 border border-gray-300 overflow-hidden ${approved ? 'avatar-glow' : current ?  'avatar-active' : ''} ${animatingRole === role ? 'avatar-current-glow' : ''} node-shadow`}>
                    <Avatar src={avatar} alt={role} status={status} />
                  </div>
                </div>
                <div className="text-center mt-2 text-sm font-medium">{role}</div>
              </div>
            );
          })}
        </div>

        {user.role !== "Employee" && isCurrentApprover && (
          <div className="mt-6 flex flex-col items-end">
            <p className="text-gray-600 text-left mr-12 mb-4">Check Details, Then Approve or Reject</p>
            <div className="flex gap-4">
              <button onClick={handleReject} disabled={processing} className="bg-[#F34040] text-white px-7 py-2 rounded-md shadow hover:bg-red-700 disabled:opacity-50 transition">
                Reject Leave
              </button>
              <button onClick={handleApprove} disabled={processing} className="bg-[#31ED31] text-white px-7 py-2 rounded-md shadow hover:bg-green-700 disabled:opacity-50 transition">
                Approve Leave
              </button>
            </div>
          </div>

        )}
      </div>
    </div>
  );
}
