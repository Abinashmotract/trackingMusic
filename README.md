# 🐄 Milking Tracker with Music 🎵

A fullstack web application for dairy farmers to track milking sessions while playing calming music for cattle.

## 📋 Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** (comes with Node.js)

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/Abinashmotract/trackingMusic
cd "Tracker Music"
```

### Step 2: Setup Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `backend` folder:
```bash
touch .env
```

4. Add the following content to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackingmusic
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackingmusic
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the `frontend` folder:
```bash
touch .env.local
```

4. Add the following content to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
Tracker Music/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── MilkingSession.js     # MongoDB schema
│   ├── routes/
│   │   └── sessions.js           # API routes
│   ├── .env                      # Environment variables (create this)
│   ├── package.json
│   └── server.js                  # Express server
│
└── frontend/
    ├── components/
    │   ├── history/              # History page components
    │   ├── landing/              # Landing page components
    │   └── layout/               # Navbar & Footer
    ├── hooks/
    │   ├── useSessions.js       # Data fetching hook
    │   └── useSessionGuard.js   # Session guard hook
    ├── pages/
    │   ├── _app.js              # App wrapper
    │   ├── index.js             # Landing page
    │   ├── milking.js           # Milking session page
    │   └── history.js           # History page
    ├── public/
    │   └── music/               # Music files
    ├── styles/
    │   ├── globals.css          # Global styles
    │   └── landing.css          # Landing page styles
    ├── utils/
    │   ├── dateFormatters.js    # Date formatting utilities
    │   └── landingData.js       # Static data
    ├── .env.local               # Environment variables (create this)
    └── package.json
```

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

## 📡 API Endpoints

### GET /sessions
Retrieve milking sessions with pagination.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalSessions": 50,
      "limit": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### POST /sessions
Save a new milking session.

**Request Body:**
```json
{
  "start_time": "2025-03-10T14:00:00.000Z",
  "end_time": "2025-03-10T14:15:00.000Z",
  "duration": 900,
  "milk_quantity": 5.2
}
```

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "Milking session created successfully",
  "data": {
    "id": "...",
    "start_time": "...",
    "end_time": "...",
    "duration": 900,
    "milk_quantity": 5.2
  }
}
```

## 🎯 Features

- ✅ Landing page with statistics and features
- ✅ Milking session with timer and music
- ✅ Pause/Resume functionality
- ✅ Session history with pagination
- ✅ Mobile-responsive design
- ✅ Navigation guard for active sessions
- ✅ Professional UI/UX

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

### Frontend
- Next.js 14
- React 18
- Custom Hooks
- CSS3

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- Music files are located in `frontend/public/music/`
- All API responses follow a consistent format with `success`, `status`, `message`, and `data` fields
- Backend pagination is implemented (10 items per page by default)

## 🐛 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify MongoDB connection string in `.env`
- Check if port 5000 is available

**Frontend can't connect to backend:**
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Make sure backend is running
- Check CORS settings

**Music not playing:**
- Ensure music file exists in `frontend/public/music/`
- Check browser console for errors
- Some browsers require user interaction before playing audio
