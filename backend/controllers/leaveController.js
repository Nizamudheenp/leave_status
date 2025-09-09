const leaveDB = require('../models//LeaveRequest');
const userDB = require('../models/userModel');

const getNextApprover = async (currentRole) => {
    const roles = ['Employee', 'Team Lead', 'Project Lead', 'HR', 'CEO'];
    const nextIndex = roles.indexOf(currentRole) + 1;
    if (nextIndex < roles.length) {
        return roles[nextIndex];
    }
    return null;
};

exports.applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const employee = req.user;

        const nextRole = await getNextApprover(employee.role);
        const nextApprover = await userDB.findOne({ role: nextRole });

        const leave = new LeaveRequest({
            employeeId: employee._id,
            startDate,
            endDate,
            reason,
            currentApprover: nextApprover ? nextApprover._id : null,
            approvalFlow: [{
                approver: employee._id,
                status: 'Approved',
                date: new Date()
            }]
        });

        await leave.save();
        res.status(201).json({ message: 'Leave applied successfully', leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLeave = async (req, res) => {
    try {
        const leave = await leaveDB.findById(req.params.id)
            .populate('employeeId', 'name role profileImage')
            .populate('currentApprover', 'name role profileImage')
            .populate('approvalFlow.approver', 'name role profileImage');

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveLeave = async (req, res) => {
    try {
        const leave = await leaveDB.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        const approver = req.user;
        if (!leave.currentApprover || !leave.currentApprover.equals(approver._id)) {
            return res.status(403).json({ message: 'You are not authorized to approve this leave' });
        }

        leave.approvalFlow.push({
            approver: approver._id,
            status: 'Approved',
            date: new Date()
        });

        const nextRole = await getNextApprover(approver.role);
        const nextApprover = await User.findOne({ role: nextRole });

        if (nextApprover) {
            leave.currentApprover = nextApprover._id;
            leave.status = 'Pending';
            await leave.save();
            res.json({ message: `Leave approved. Next approver is ${nextApprover.name}`, leave });
        } else {
            leave.currentApprover = null;
            leave.status = 'Approved';
            await leave.save();
            res.json({ message: 'Leave fully approved by CEO', leave });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectLeave = async (req, res) => {
    try {
        const leave = await leaveDB.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        const approver = req.user;
        if (!leave.currentApprover || !leave.currentApprover.equals(approver._id)) {
            return res.status(403).json({ message: 'You are not authorized to reject this leave' });
        }

        leave.approvalFlow.push({
            approver: approver._id,
            status: 'Rejected',
            date: new Date()
        });

        leave.currentApprover = null;
        leave.status = 'Rejected';

        await leave.save();
        res.json({ message: 'Leave rejected', leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
