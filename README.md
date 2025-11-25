# RankRiseUSA Web Lead Management System (Web CRM)

A full-stack web-based CRM system for managing leads with Excel import/export, duplicate detection, role-based access, and a modern responsive UI.

## 🚀 Features

### Core Features
- ✅ **JWT Authentication** - Secure email/password login
- ✅ **Role-Based Access** - Admin and Staff roles with different permissions
- ✅ **Lead Management** - Full CRUD operations for leads
- ✅ **Advanced Search & Filters** - Search by name, email, phone, company with multiple filter options
- ✅ **Pagination & Sorting** - Server-side pagination and column sorting
- ✅ **Dashboard Analytics** - Stats cards showing total, hot, warm, cold, won leads
- ✅ **Dark/Light Mode** - Toggle between themes
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop

### Excel Features
- ✅ **Excel/CSV Import** - Upload and import leads from Excel/CSV files
- ✅ **Smart Merge** - Merge Excel data with intelligent duplicate detection
- ✅ **Duplicate Detection** - Detects duplicates by:
  - Same email
  - Same phone number
  - Same name + company
- ✅ **Excel Export** - Download all leads as Excel file
- ✅ **Duplicate Report** - View all leads with duplicate counts

### Access Control
- **Admin**: Can see all leads, create users, delete leads
- **Staff**: Can only see their assigned leads

## 📁 Project Structure

```
lead_pro/
├── server/              # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # User and Lead models
│   │   ├── controllers/ # Auth, Lead, File controllers
│   │   ├── middleware/  # JWT authentication middleware
│   │   ├── routes/      # API routes
│   │   ├── server.js    # Main server file
│   │   └── seed.js      # Sample data seeder
│   ├── .env             # Environment variables
│   └── package.json
│
└── client/              # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # Auth context
    │   ├── pages/       # Dashboard, Leads, Duplicates
    │   ├── utils/       # API configuration
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **xlsx** - Excel parsing/generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP requests
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 📦 Installation

### Prerequisites
- Node.js 18+ (recommended) or 16+
- MongoDB 4.4+
- npm or yarn

### Step 1: Clone & Install Dependencies

```bash
# Navigate to project directory
cd /media/H-Drive/Project/shivam\'s\ pro/lead_pro

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

The `.env` file is already created in the `server` directory with default values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rankrise_crm
JWT_SECRET=rankriseusa-jwt-secret-key-2025
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` in production!

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS (Homebrew)
brew services start mongodb-community

# Windows
# MongoDB should start automatically or use MongoDB Compass
```

### Step 4: Seed Sample Data (Optional)

Create sample users and leads:

```bash
cd server
npm run seed
```

This creates:
- **Admin**: admin@rankriseusa.com / admin123
- **Staff**: staff@rankriseusa.com / staff123
- 5 sample leads

### Step 5: Run the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

Server runs on: `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 🔐 Login Credentials

After seeding:
- **Admin**: admin@rankriseusa.com / admin123
- **Staff**: staff@rankriseusa.com / staff123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user

### Leads
- `GET /api/leads` - Get all leads (with pagination, search, filters)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead (Admin only)
- `GET /api/leads/stats/dashboard` - Get dashboard statistics

### Files
- `POST /api/files/import` - Import leads from Excel/CSV
- `POST /api/files/merge` - Merge Excel with duplicate detection
- `GET /api/files/export` - Export leads to Excel
- `GET /api/files/duplicates` - Get duplicate leads

## 🎨 Features in Detail

### Advanced Filters
Filter leads by:
- Status (New, Hot, Warm, Cold, Won, Lost)
- Source (Website, Referral, etc.)
- Budget range (min/max)
- Date range
- Show only duplicates

### Duplicate Detection Logic
The merge system detects duplicates using three rules:
1. **Email Match**: Same email address
2. **Phone Match**: Same contact number
3. **Name + Company Match**: Same name AND company name

When duplicates are found:
- Existing record is updated with new data
- Duplicate count is incremented
- No new record is created

### Excel Import/Merge
- Automatically normalizes column names
- Supports various column name formats (e.g., "phone", "contact", "mobile")
- Validates data before import
- Provides detailed merge summary

## 🚢 Production Deployment

### Backend Deployment

1. **Set environment variables**:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-uri
JWT_SECRET=your-strong-secret-key
```

2. **Build and run**:
```bash
cd server
npm start
```

### Frontend Deployment

1. **Build for production**:
```bash
cd client
npm run build
```

2. **Deploy the `dist` folder** to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Your own server

3. **Update API base URL** in production build if needed (currently uses proxy)

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'staff',
  isActive: Boolean
}
```

### Lead Model
```javascript
{
  name: String,
  company_name: String,
  company_url: String,
  email: String,
  contact_number: String,
  response_text: String,
  status: 'New' | 'Hot' | 'Warm' | 'Cold' | 'Won' | 'Lost',
  last_contact_date: Date,
  notes: String,
  source: String,
  service_type: String,
  budget: Number,
  assigned_to: ObjectId (User),
  duplicate_count: Number,
  created_by: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development Commands

### Backend
```bash
npm run dev      # Development with nodemon
npm start        # Production
npm run seed     # Seed sample data
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🎯 Usage Workflow

1. **Login** with admin or staff credentials
2. **View Dashboard** to see lead statistics
3. **Manage Leads**:
   - Search and filter leads
   - Add new leads manually
   - Edit existing leads
   - Delete leads (admin only)
4. **Import Excel**:
   - Click "Import" button
   - Choose "Import" or "Merge"
   - Upload Excel/CSV file
   - View import summary
5. **Export Data**:
   - Click "Export" to download all leads
6. **View Duplicates**:
   - Navigate to "Duplicates" page
   - See all leads with duplicate counts

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Try: `sudo systemctl status mongod`

### Port Already in Use
- Change `PORT` in server `.env`
- Change port in client `vite.config.js`

### JWT Errors
- Clear browser localStorage
- Check `JWT_SECRET` is set
- Re-login

### Excel Upload Fails
- Check file size (max 10MB)
- Ensure file is .xlsx, .xls, or .csv
- Verify multer is installed

## 📄 License

This project is proprietary software created for RankRiseUSA.

## 👨‍💻 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for RankRiseUSA**
# lead_CRM
