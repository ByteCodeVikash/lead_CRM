const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
    importLeads,
    mergeLeads,
    exportLeads,
    getDuplicates
} = require('../controllers/fileController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
        }
    }
});

router.post('/import', protect, upload.single('file'), importLeads);
router.post('/merge', protect, upload.single('file'), mergeLeads);
router.get('/export', protect, exportLeads);
router.get('/duplicates', protect, getDuplicates);

module.exports = router;
