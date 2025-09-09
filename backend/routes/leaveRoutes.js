const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { applyLeave, getLeave, approveLeave, rejectLeave } = require('../controllers/leaveController');
const router = express.Router();

router.post('/', authMiddleware, applyLeave);
router.get('/:id', authMiddleware, getLeave);
router.put('/:id/approve', authMiddleware, approveLeave);
router.put('/:id/reject', authMiddleware, rejectLeave);

module.exports = router;
