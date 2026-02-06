# 📚 Code Explanation - Milking Tracker

यह file में project के सभी important parts की explanation है।

## 🏗️ Project Structure

```
Milking Tracker/
├── backend/          # Node.js + Express + MongoDB
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── models/       # Database models
│   └── routes/       # API routes
└── frontend/         # Next.js + React
    ├── components/   # Reusable components
    ├── hooks/        # Custom React hooks
    ├── pages/        # Next.js pages
    └── styles/       # CSS files
```

---

## 🔧 Backend Explanation

### 1. **Database Configuration** (`backend/config/database.js`)

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,           // MongoDB connection options
      useUnifiedTopology: true,        // Use new connection management
      serverSelectionTimeoutMS: 30000, // Wait 30 seconds for server selection
      socketTimeoutMS: 45000,          // Wait 45 seconds for socket operations
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);  // Exit if connection fails
  }
};
```

**क्या करता है:**
- MongoDB database से connect करता है
- Connection options set करता है
- Error handling करता है

---

### 2. **Database Model** (`backend/models/MilkingSession.js`)

```javascript
const milkingSessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => crypto.randomUUID(),  // Auto-generate UUID
  },
  start_time: {
    type: Date,
    required: true,  // Must have start time
  },
  end_time: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,  // Duration can't be negative
  },
  milk_quantity: {
    type: Number,
    required: true,
    min: 0,  // Quantity can't be negative
  },
  created_at: {
    type: Date,
    default: Date.now,  // Auto-set when created
  },
});
```

**क्या करता है:**
- Database में milking session का structure define करता है
- Validation rules set करता है (min: 0, required fields)
- Auto-generate UUID और timestamp

---

### 3. **API Controller** (`backend/controllers/sessionsController.js`)

#### **GET /sessions** - Sessions fetch करने के लिए

```javascript
const getSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;    // Page number (default: 1)
    const limit = parseInt(req.query.limit) || 10;  // Items per page (default: 10)
    const skip = (page - 1) * limit;                // Calculate how many to skip

    // Validate pagination
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid page/limit' });
    }

    // Get total count for pagination
    const totalSessions = await MilkingSession.countDocuments();
    const totalPages = Math.ceil(totalSessions / limit);

    // Fetch sessions with pagination
    const sessions = await MilkingSession.find()
      .sort({ created_at: -1 })  // Newest first
      .skip(skip)                 // Skip previous pages
      .limit(limit);              // Limit results

    // Format response
    const formattedSessions = sessions.map((session) => ({
      id: session._id,
      start_time: session.start_time.toISOString(),
      end_time: session.end_time.toISOString(),
      duration: session.duration,
      milk_quantity: session.milk_quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        sessions: formattedSessions,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalSessions: totalSessions,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};
```

**क्या करता है:**
- Database से sessions fetch करता है
- Pagination support (page, limit)
- Newest sessions पहले दिखाता है
- Formatted response return करता है

#### **POST /sessions** - नया session save करने के लिए

```javascript
const createSession = async (req, res) => {
  try {
    const { start_time, end_time, duration, milk_quantity } = req.body;

    // Validation - check if all required fields are present
    if (!start_time || !end_time || duration === undefined || milk_quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validation - check if values are non-negative
    if (duration < 0 || milk_quantity < 0) {
      return res.status(400).json({ error: 'Values must be non-negative' });
    }

    // Create new session
    const session = new MilkingSession({
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration: parseInt(duration),
      milk_quantity: parseFloat(milk_quantity),
    });

    // Save to database
    const savedSession = await session.save();

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        id: savedSession._id,
        start_time: savedSession.start_time.toISOString(),
        end_time: savedSession.end_time.toISOString(),
        duration: savedSession.duration,
        milk_quantity: savedSession.milk_quantity,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
};
```

**क्या करता है:**
- Request body से data लेता है
- Validation करता है (required fields, non-negative values)
- Database में save करता है
- Success response return करता है

---

### 4. **Server Setup** (`backend/server.js`)

```javascript
require('dotenv').config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());                    // Allow cross-origin requests
app.use(express.json());             // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/sessions', sessionsRouter);  // All /sessions routes

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**क्या करता है:**
- Express server setup करता है
- MongoDB connect करता है
- CORS enable करता है (frontend से requests allow करने के लिए)
- Routes define करता है
- Error handling करता है

---

## 🎨 Frontend Explanation

### 1. **Milking Session Page** (`frontend/pages/milking.js`)

#### **State Management**

```javascript
const [isRunning, setIsRunning] = useState(false);      // Timer running hai ya nahi
const [isPaused, setIsPaused] = useState(false);        // Timer paused hai ya nahi
const [seconds, setSeconds] = useState(0);              // Timer seconds
const [startTime, setStartTime] = useState(null);       // Session start time
const [showModal, setShowModal] = useState(false);      // Milk quantity modal show karega
const [milkQuantity, setMilkQuantity] = useState('');  // User input milk quantity
const audioRef = useRef(null);                          // Audio element reference
const intervalRef = useRef(null);                       // Timer interval reference
```

#### **Start Session**

```javascript
const handleStart = () => {
  setStartTime(new Date());        // Current time save karo
  setIsRunning(true);              // Timer start karo
  setIsPaused(false);              // Pause nahi hai
  setSeconds(0);                    // Timer 0 se start

  // Music play karo
  if (audioRef.current) {
    audioRef.current.play();
  }
};
```

**क्या करता है:**
- Timer start करता है
- Music play करता है
- Start time save करता है

#### **Pause/Resume**

```javascript
const handlePauseResume = () => {
  if (isPaused) {
    // Resume karo
    setIsPaused(false);
    audioRef.current.play();  // Music resume
  } else {
    // Pause karo
    setIsPaused(true);
    audioRef.current.pause();  // Music pause
  }
};
```

**क्या करता है:**
- Timer pause/resume करता है
- Music भी pause/resume करता है

#### **Timer Logic**

```javascript
useEffect(() => {
  if (isRunning && !isPaused) {
    // Timer running hai aur paused nahi hai
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);  // Har second +1 karo
    }, 1000);
  } else {
    // Timer stop karo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  // Cleanup - component unmount pe interval clear karo
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isRunning, isPaused]);
```

**क्या करता है:**
- Har second timer update करता है
- Pause/resume handle करता है
- Memory leak prevent करता है (cleanup)

#### **Stop Session & Save**

```javascript
const handleStop = () => {
  setIsRunning(false);
  setIsPaused(false);
  audioRef.current.pause();
  audioRef.current.currentTime = 0;  // Music reset
  setShowModal(true);  // Modal show karo milk quantity ke liye
};

const handleSubmit = async () => {
  // Validation
  if (!milkQuantity || parseFloat(milkQuantity) < 0) {
    alert('Please enter a valid milk quantity');
    return;
  }

  const endTime = new Date();
  const duration = seconds;

  // API call to save session
  const response = await fetch(`${apiUrl}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration: duration,
      milk_quantity: parseFloat(milkQuantity),
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    router.push('/history');  // History page pe redirect
  }
};
```

**क्या करता है:**
- Timer stop करता है
- Milk quantity input लेता है
- Backend API को data send करता है
- Success pe history page pe redirect करता है

---

### 2. **History Page** (`frontend/pages/history.js`)

```javascript
export default function History() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  // Custom hook se sessions fetch karo
  const { sessions, loading, error, pagination } = useSessions(currentPage, limit);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : sessions.length > 0 ? (
        <>
          <HistoryStats sessions={sessions} />
          <HistoryTable 
            sessions={sessions} 
            pagination={pagination}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div>No sessions found</div>
      )}
    </div>
  );
}
```

**क्या करता है:**
- Backend se sessions fetch करता है
- Loading/error states handle करता है
- Table में sessions display करता है
- Pagination support

---

### 3. **Custom Hook** (`frontend/hooks/useSessions.js`)

```javascript
export function useSessions(page = 1, limit = 10) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchSessions(page, limit);
  }, [page, limit]);

  const fetchSessions = async (currentPage, currentLimit) => {
    try {
      setLoading(true);
      
      // API call
      const response = await fetch(
        `${apiUrl}/sessions?page=${currentPage}&limit=${currentLimit}`
      );
      const result = await response.json();
      
      if (result.success) {
        setSessions(result.data.sessions);
        setPagination(result.data.pagination);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error loading sessions');
    } finally {
      setLoading(false);
    }
  };

  return { sessions, loading, error, pagination };
}
```

**क्या करता है:**
- Reusable hook hai sessions fetch करने के लिए
- Loading, error, pagination handle करता है
- Multiple components में use हो सकता है

---

## 🔄 Data Flow

### **Session Create करने का Flow:**

1. **User clicks "Start Milking"**
   - `handleStart()` call hota hai
   - Timer start hota hai
   - Music play hota hai

2. **User clicks "Stop"**
   - `handleStop()` call hota hai
   - Modal show hota hai milk quantity ke liye

3. **User enters quantity and clicks "Save"**
   - `handleSubmit()` call hota hai
   - Frontend se POST request `/sessions` pe jata hai
   - Backend controller receive karta hai
   - Database mein save hota hai
   - Success response aata hai
   - User history page pe redirect hota hai

### **Sessions Fetch करने का Flow:**

1. **User opens History page**
   - `useSessions()` hook call hota hai
   - GET request `/sessions?page=1&limit=10` pe jata hai
   - Backend controller database se data fetch karta hai
   - Paginated response aata hai
   - Frontend table mein display hota hai

---

## 🎯 Key Concepts

### **React Hooks:**
- `useState` - State manage करने के लिए
- `useEffect` - Side effects (API calls, timers) के लिए
- `useRef` - DOM elements reference करने के लिए

### **Next.js:**
- `pages/` folder - Automatic routing
- `Head` component - Page metadata
- `useRouter` - Navigation

### **MongoDB/Mongoose:**
- `Schema` - Data structure define
- `Model` - Database operations
- `find()`, `save()`, `countDocuments()` - Database queries

### **Express:**
- `Router` - Route handling
- `Middleware` - Request processing
- `req.body` - Request data
- `res.json()` - Response send

---

## 📝 Important Notes

1. **Environment Variables:**
   - `MONGODB_URI` - Database connection string
   - `NEXT_PUBLIC_API_URL` - Backend API URL

2. **Error Handling:**
   - Try-catch blocks sab jagah use kiye gaye hain
   - User-friendly error messages

3. **Validation:**
   - Frontend validation (required fields, min values)
   - Backend validation (data types, constraints)

4. **Security:**
   - CORS enabled for cross-origin requests
   - Input validation to prevent invalid data

---

## 🚀 How to Use

1. **Backend start karo:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend start karo:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Browser mein open karo:**
   - `http://localhost:3000` - Landing page
   - `http://localhost:3000/milking` - Start milking session
   - `http://localhost:3000/history` - View history

---

**यह explanation file आपको code समझने में help करेगी!** 🎉
