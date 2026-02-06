🐄 Milking Tracker (with Music 🎵)

A full-stack app to track milking sessions with a timer + calm music.

🔗 Live

Frontend: https://trackingmusic-1.onrender.com
Backend: https://trackingmusic.onrender.com

🧰 Tech

Frontend: Next.js, React

Backend: Node.js, Express, MongoDB

✨ Features

Start / Pause / Resume milking timer

Save milk quantity

Session history with pagination

Plays background music

Responsive UI

📁 Structure
  backend/
  frontend/

⚙️ Setup (Local)

1) Clone

git clone https://github.com/Abinashmotract/milking-tracker
cd milking-tracker

2) Backend

cd backend
npm install


Create backend/.env

PORT=5000
MONGODB_URI=mongodb://localhost:27017/milkingtracker
NODE_ENV=development


Run:

npm run dev

3) Frontend

cd ../frontend
npm install


Create frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:5000


Run:

npm run dev

📌 API
GET /sessions (page, limit)
POST /sessions