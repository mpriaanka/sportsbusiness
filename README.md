# 🏟️ ProStar Sports Academy - Slot Booking System

A full-stack sports facility booking platform with role-based dashboards, interactive slot booking, simulated payments, equipment management, and notification system.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express + Sequelize ORM
- **Database**: PostgreSQL
- **Auth**: JWT-based with role-based access
- **UI Library**: Framer Motion, Recharts, React Icons, React Hot Toast

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL installed and running

### 1. Database Setup
```bash
# Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE sports_academy;"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Update .env with your PostgreSQL credentials if needed
# Default: postgres/postgres on localhost:5432

# Seed sample data
node seed.js

# Start the server
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app
Navigate to `http://ProAcademy:5173`

## Demo Accounts

| Role    | Email                  | Password     |
|---------|------------------------|--------------|
| Admin   | admin@sports.com       | password123  |
| Manager | manager1@sports.com    | password123  |
| Manager | manager2@sports.com    | password123  |
| Client  | client1@sports.com     | password123  |
| Client  | client2@sports.com     | password123  |
| Client  | client3@sports.com     | password123  |

## Features

### Client
- Browse sports & courts
- Interactive slot booking (calendar + time grid)
- Equipment selection with live price updates
- 50% advance payment system with progress tracking
- Booking history with status filters

### Manager
- Dashboard with analytics (bar/pie charts)
- Schedule management (CRUD)
- View all bookings
- Send notifications to clients

### Admin
- CRUD for Sports, Courts, Equipment
- User/Manager management
- All bookings view
- Revenue analytics & reports

## API Endpoints

| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | /api/auth/signup       | Register user        |
| POST   | /api/auth/login        | Login                |
| GET    | /api/sports            | List sports          |
| GET    | /api/courts            | List courts          |
| GET    | /api/bookings/available-slots | Available slots |
| POST   | /api/bookings          | Create booking       |
| POST   | /api/payments          | Make payment         |
| GET    | /api/bookings          | List bookings        |
| GET    | /api/bookings/stats    | Analytics data       |
