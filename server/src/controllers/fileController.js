const XLSX = require('xlsx');
const Lead = require('../models/Lead');

// Helper: Detect duplicate
const findDuplicate = async (leadData) => {
    const { email, contact_number, name, company_name } = leadData;

    let duplicate = null;

    // Check email duplicate
    if (email && email.trim()) {
        duplicate = await Lead.findOne({ email: email.trim().toLowerCase() });
        if (duplicate) return duplicate;
    }

    // Check phone duplicate
    if (contact_number && contact_number.trim()) {
        duplicate = await Lead.findOne({ contact_number: contact_number.trim() });
        if (duplicate) return duplicate;
    }

    // Check name + company duplicate
    if (name && name.trim() && company_name && company_name.trim()) {
        duplicate = await Lead.findOne({
            name: new RegExp(`^${name.trim()}$`, 'i'),
            company_name: new RegExp(`^${company_name.trim()}$`, 'i')
        });
        if (duplicate) return duplicate;
    }

    return null;
};

// Helper: Normalize column names
const normalizeColumns = (data) => {
    const columnMap = {
        'name': ['name', 'full name', 'contact name', 'lead name'],
        'company_name': ['company', 'company name', 'company_name', 'organization'],
        'company_url': ['website', 'company url', 'url', 'company_url', 'site'],
        'email': ['email', 'email address', 'e-mail', 'mail'],
        'contact_number': ['phone', 'contact', 'mobile', 'contact_number', 'phone number', 'contact number'],
        'response_text': ['response', 'message', 'notes', 'response_text', 'description'],
        'status': ['status', 'lead status', 'stage'],
        'source': ['source', 'lead source', 'channel'],
        'service_type': ['service', 'service type', 'service_type', 'product'],
        'budget': ['budget', 'amount', 'value'],
        'notes': ['notes', 'comments', 'remarks']
    };

    return data.map(row => {
        const normalized = {};

        Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase().trim();

            for (const [standardKey, aliases] of Object.entries(columnMap)) {
                if (aliases.includes(lowerKey)) {
                    normalized[standardKey] = row[key];
                    break;
                }
            }

            // If no match found, keep original
            if (!Object.values(columnMap).flat().includes(lowerKey)) {
                normalized[key] = row[key];
            }
        });

        return normalized;
    });
};

// @desc    Import leads from Excel/CSV
// @route   POST /api/files/import
// @access  Private
exports.importLeads = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'File is empty or invalid'
            });
        }

        // Normalize columns
        data = normalizeColumns(data);

        let newCount = 0;
        let duplicateCount = 0;
        const errors = [];

        for (const row of data) {
            try {
                const leadData = {
                    name: row.name || '',
                    company_name: row.company_name || '',
                    company_url: row.company_url || '',
                    email: row.email || '',
                    contact_number: row.contact_number || '',
                    response_text: row.response_text || '',
                    status: row.status || 'New',
                    source: row.source || 'Import',
                    service_type: row.service_type || '',
                    budget: row.budget ? parseFloat(row.budget) : undefined,
                    notes: row.notes || '',
                    created_by: req.user.id
                };

                // Skip if no name
                if (!leadData.name.trim()) {
                    continue;
                }

                await Lead.create(leadData);
                newCount++;
            } catch (error) {
                errors.push({ row, error: error.message });
            }
        }

        res.json({
            success: true,
            data: {
                new_leads: newCount,
                errors: errors.length,
                error_details: errors.slice(0, 10) // Show max 10 errors
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

// @desc    Merge leads from Excel/CSV with duplicate detection
// @route   POST /api/files/merge
// @access  Private
exports.mergeLeads = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'File is empty or invalid'
            });
        }

        // Normalize columns
        data = normalizeColumns(data);

        let newCount = 0;
        let duplicateCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const row of data) {
            try {
                const leadData = {
                    name: row.name || '',
                    company_name: row.company_name || '',
                    company_url: row.company_url || '',
                    email: row.email ? row.email.trim().toLowerCase() : '',
                    contact_number: row.contact_number ? row.contact_number.trim() : '',
                    response_text: row.response_text || '',
                    status: row.status || 'New',
                    source: row.source || 'Import',
                    service_type: row.service_type || '',
                    budget: row.budget ? parseFloat(row.budget) : undefined,
                    notes: row.notes || ''
                };

                // Skip if no name
                if (!leadData.name.trim()) {
                    skippedCount++;
                    continue;
                }

                // Check for duplicate
                const duplicate = await findDuplicate(leadData);

                if (duplicate) {
                    // Update existing lead
                    duplicate.duplicate_count = (duplicate.duplicate_count || 0) + 1;

                    // Update fields only if new data exists
                    if (leadData.company_name) duplicate.company_name = leadData.company_name;
                    if (leadData.company_url) duplicate.company_url = leadData.company_url;
                    if (leadData.response_text) duplicate.response_text = leadData.response_text;
                    if (leadData.source) duplicate.source = leadData.source;
                    if (leadData.service_type) duplicate.service_type = leadData.service_type;
                    if (leadData.budget) duplicate.budget = leadData.budget;
                    if (leadData.notes) duplicate.notes = leadData.notes;

                    await duplicate.save();
                    duplicateCount++;
                    updatedCount++;
                } else {
                    // Create new lead
                    leadData.created_by = req.user.id;
                    await Lead.create(leadData);
                    newCount++;
                }
            } catch (error) {
                skippedCount++;
                console.error('Error processing row:', error);
            }
        }

        res.json({
            success: true,
            data: {
                new_leads: newCount,
                duplicates: duplicateCount,
                updated: updatedCount,
                skipped: skippedCount,
                total_processed: data.length
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

// @desc    Export leads to Excel
// @route   GET /api/files/export
// @access  Private
exports.exportLeads = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'staff') {
            query.assigned_to = req.user.id;
        }

        const leads = await Lead.find(query)
            .populate('assigned_to', 'name email')
            .sort('-createdAt');

        const exportData = leads.map(lead => ({
            'Name': lead.name,
            'Company': lead.company_name,
            'Company URL': lead.company_url,
            'Email': lead.email,
            'Contact Number': lead.contact_number,
            'Status': lead.status,
            'Source': lead.source,
            'Service Type': lead.service_type,
            'Budget': lead.budget,
            'Response': lead.response_text,
            'Notes': lead.notes,
            'Last Contact': lead.last_contact_date ? lead.last_contact_date.toISOString().split('T')[0] : '',
            'Created Date': lead.createdAt.toISOString().split('T')[0],
            'Assigned To': lead.assigned_to?.name || '',
            'Duplicate Count': lead.duplicate_count
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=leads_export_${Date.now()}.xlsx`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get duplicate leads
// @route   GET /api/files/duplicates
// @access  Private
exports.getDuplicates = async (req, res) => {
    try {
        let query = { duplicate_count: { $gt: 0 } };

        if (req.user.role === 'staff') {
            query.assigned_to = req.user.id;
        }

        const duplicates = await Lead.find(query)
            .populate('assigned_to', 'name email')
            .sort('-duplicate_count');

        res.json({
            success: true,
            data: duplicates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
