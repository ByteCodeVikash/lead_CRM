const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Lead = require('./models/Lead');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Lead.deleteMany();

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@rankriseusa.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create staff user
        const staff = await User.create({
            name: 'Staff User',
            email: 'staff@rankriseusa.com',
            password: 'staff123',
            role: 'staff'
        });

        // Create sample leads
        const sampleLeads = [
            {
                name: 'John Doe',
                company_name: 'Tech Corp',
                company_url: 'https://techcorp.com',
                email: 'john@techcorp.com',
                contact_number: '+1234567890',
                status: 'Hot',
                source: 'Website',
                service_type: 'SEO',
                budget: 5000,
                notes: 'Very interested in our services',
                created_by: admin._id,
                assigned_to: staff._id
            },
            {
                name: 'Jane Smith',
                company_name: 'Marketing Pro',
                company_url: 'https://marketingpro.com',
                email: 'jane@marketingpro.com',
                contact_number: '+1987654321',
                status: 'Warm',
                source: 'Referral',
                service_type: 'PPC',
                budget: 3000,
                notes: 'Needs proposal',
                created_by: admin._id,
                assigned_to: admin._id
            },
            {
                name: 'Bob Johnson',
                company_name: 'StartupXYZ',
                email: 'bob@startupxyz.com',
                contact_number: '+1122334455',
                status: 'New',
                source: 'Cold Call',
                service_type: 'Social Media',
                budget: 2000,
                created_by: admin._id
            },
            {
                name: 'Alice Williams',
                company_name: 'Enterprise Solutions',
                email: 'alice@enterprise.com',
                contact_number: '+1555666777',
                status: 'Cold',
                source: 'Email Campaign',
                service_type: 'Content Marketing',
                budget: 10000,
                created_by: staff._id,
                assigned_to: staff._id
            },
            {
                name: 'Charlie Brown',
                company_name: 'Local Business',
                email: 'charlie@localbiz.com',
                contact_number: '+1999888777',
                status: 'Won',
                source: 'Website',
                service_type: 'Local SEO',
                budget: 1500,
                notes: 'Signed contract',
                created_by: admin._id,
                assigned_to: admin._id
            }
        ];

        await Lead.insertMany(sampleLeads);

        console.log('✅ Sample data seeded successfully');
        console.log('\nLogin Credentials:');
        console.log('Admin: admin@rankriseusa.com / admin123');
        console.log('Staff: staff@rankriseusa.com / staff123');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
