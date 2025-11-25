const XLSX = require('xlsx');
const path = require('path');

// Sample lead data for testing Excel import/merge
const sampleData = [
    {
        'Name': 'David Miller',
        'Company': 'TechStart Inc',
        'Email': 'david@techstart.com',
        'Phone': '+1234567890',
        'Status': 'Hot',
        'Source': 'LinkedIn',
        'Service Type': 'Web Development',
        'Budget': 8000,
        'Notes': 'Interested in full website redesign'
    },
    {
        'Name': 'Sarah Johnson',
        'Company': 'Marketing Solutions',
        'Email': 'sarah@marketing.com',
        'Phone': '+1555123456',
        'Status': 'Warm',
        'Source': 'Cold Email',
        'Service Type': 'SEO',
        'Budget': 3500,
        'Notes': 'Wants ongoing SEO services'
    },
    {
        'Name': 'John Doe', // Duplicate - same as existing lead
        'Company': 'Tech Corp',
        'Email': 'john@techcorp.com',
        'Phone': '+1234567890',
        'Status': 'Hot',
        'Source': 'Referral',
        'Service Type': 'SEO',
        'Budget': 6000,
        'Notes': 'Updated budget and status'
    },
    {
        'Name': 'Emily Davis',
        'Company': 'E-Commerce Plus',
        'Email': 'emily@ecommerceplus.com',
        'Phone': '+1777888999',
        'Status': 'New',
        'Source': 'Website',
        'Service Type': 'PPC',
        'Budget': 5000,
        'Notes': 'Looking for Google Ads management'
    },
    {
        'Name': 'Michael Brown',
        'Company': 'StartupHub',
        'Email': 'michael@startuphub.com',
        'Phone': '+1222333444',
        'Status': 'Warm',
        'Source': 'Referral',
        'Service Type': 'Social Media',
        'Budget': 2500,
        'Notes': 'Social media marketing campaign'
    }
];

// Create workbook
const ws = XLSX.utils.json_to_sheet(sampleData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Leads');

// Write file
const outputPath = path.join(__dirname, 'sample_leads.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✅ Sample Excel file created: ${outputPath}`);
console.log(`📊 Contains ${sampleData.length} sample leads`);
console.log(`📝 Includes 1 duplicate lead for testing merge functionality`);
