import React, { useState } from "react";
import { useSelector } from "react-redux";
import { applyLeave } from "../api/leaveApi";
import { toast } from "react-toastify";

const ApplyLeave = () => {
    const { user } = useSelector(s => s.auth);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await applyLeave({ startDate, endDate, reason }, user.token);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error applying leave");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl mb-4">Apply for Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full border rounded p-2" required />
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full border rounded p-2" required />
                </div>
                <div>
                    <label>Reason</label>
                    <textarea value={reason} onChange={(e)=>setReason(e.target.value)} className="w-full border rounded p-2" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
            </form>
        </div>
    );
};

export default ApplyLeave;
