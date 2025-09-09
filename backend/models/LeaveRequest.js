const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending'
    },
    currentApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalFlow: [{
        approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        date: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
