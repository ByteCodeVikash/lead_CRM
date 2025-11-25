# RankRiseUSA CRM - Quick Start

## 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## 2. Start MongoDB
```bash
sudo systemctl start mongod
```

## 3. Seed Sample Data
```bash
cd server
npm run seed
```

## 4. Run Applications

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

## 5. Access Application

Open browser: http://localhost:3000

**Login:**
- Admin: admin@rankriseusa.com / admin123
- Staff: staff@rankriseusa.com / staff123

---

## Project Structure
- `/server` - Node.js + Express + MongoDB backend
- `/client` - React + Vite + Tailwind frontend

## Features
✅ JWT Authentication
✅ Lead CRUD with filters
✅ Excel Import/Export/Merge
✅ Duplicate Detection
✅ Role-based access
✅ Dark mode
