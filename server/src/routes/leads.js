const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    getStats
} = require('../controllers/leadController');

router.route('/')
    .get(protect, getLeads)
    .post(protect, createLead);

router.get('/stats/dashboard', protect, getStats);

router.route('/:id')
    .get(protect, getLead)
    .put(protect, updateLead)
    .delete(protect, deleteLead);

module.exports = router;
