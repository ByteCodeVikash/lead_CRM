const Lead = require('../models/Lead');

// @desc    Get all leads (with pagination, search, filters)
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query based on user role
        let query = {};
        if (req.user.role === 'staff') {
            query.assigned_to = req.user.id;
        }

        // Search
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { contact_number: searchRegex },
                { company_name: searchRegex }
            ];
        }

        // Filters
        if (req.query.status) query.status = req.query.status;
        if (req.query.source) query.source = new RegExp(req.query.source, 'i');
        if (req.query.service_type) query.service_type = new RegExp(req.query.service_type, 'i');

        if (req.query.budget_min || req.query.budget_max) {
            query.budget = {};
            if (req.query.budget_min) query.budget.$gte = parseFloat(req.query.budget_min);
            if (req.query.budget_max) query.budget.$lte = parseFloat(req.query.budget_max);
        }

        if (req.query.date_from || req.query.date_to) {
            query.createdAt = {};
            if (req.query.date_from) query.createdAt.$gte = new Date(req.query.date_from);
            if (req.query.date_to) query.createdAt.$lte = new Date(req.query.date_to);
        }

        // Show only duplicates
        if (req.query.duplicates === 'true') {
            query.duplicate_count = { $gt: 0 };
        }

        // Sorting
        const sortBy = req.query.sort || '-createdAt';

        const leads = await Lead.find(query)
            .populate('assigned_to', 'name email')
            .sort(sortBy)
            .limit(limit)
            .skip(skip);

        const total = await Lead.countDocuments(query);

        res.json({
            success: true,
            data: {
                leads,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('assigned_to', 'name email');

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        // Check access rights
        if (req.user.role === 'staff' && lead.assigned_to?.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this lead'
            });
        }

        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        req.body.created_by = req.user.id;

        if (req.user.role === 'staff') {
            req.body.assigned_to = req.user.id;
        }

        const lead = await Lead.create(req.body);

        res.status(201).json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        // Check access rights
        if (req.user.role === 'staff' && lead.assigned_to?.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this lead'
            });
        }

        lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        // Only admin can delete
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete leads'
            });
        }

        await lead.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/leads/stats/dashboard
// @access  Private
exports.getStats = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'staff') {
            query.assigned_to = req.user.id;
        }

        const total = await Lead.countDocuments(query);
        const hot = await Lead.countDocuments({ ...query, status: 'Hot' });
        const warm = await Lead.countDocuments({ ...query, status: 'Warm' });
        const cold = await Lead.countDocuments({ ...query, status: 'Cold' });
        const won = await Lead.countDocuments({ ...query, status: 'Won' });
        const lost = await Lead.countDocuments({ ...query, status: 'Lost' });
        const newLeads = await Lead.countDocuments({ ...query, status: 'New' });

        res.json({
            success: true,
            data: {
                total,
                hot,
                warm,
                cold,
                won,
                lost,
                new: newLeads,
                byStatus: {
                    New: newLeads,
                    Hot: hot,
                    Warm: warm,
                    Cold: cold,
                    Won: won,
                    Lost: lost
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
