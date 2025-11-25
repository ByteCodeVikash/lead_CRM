const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    company_name: {
        type: String,
        trim: true
    },
    company_url: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    contact_number: {
        type: String,
        trim: true
    },
    response_text: {
        type: String
    },
    status: {
        type: String,
        enum: ['New', 'Warm', 'Hot', 'Cold', 'Won', 'Lost'],
        default: 'New'
    },
    last_contact_date: {
        type: Date
    },
    notes: {
        type: String
    },
    source: {
        type: String,
        trim: true
    },
    service_type: {
        type: String,
        trim: true
    },
    budget: {
        type: Number
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    duplicate_count: {
        type: Number,
        default: 0
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for performance
leadSchema.index({ email: 1 });
leadSchema.index({ contact_number: 1 });
leadSchema.index({ name: 1, company_name: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assigned_to: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
