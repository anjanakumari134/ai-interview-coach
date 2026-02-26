# MongoDB Setup Guide for AI Interview Coach

## 🎯 Overview
This guide shows how to set up MongoDB for the AI Interview Coach system with authentication and interview management.

## ✅ Setup Complete

### Database Configuration
- **MongoDB**: Installed and running on `localhost:27017`
- **Database Name**: `ai-interview-coach`
- **Backend**: Connected and running on `http://localhost:5001`
- **Frontend**: Configured to use real API

### Collections Created
1. **users** - User authentication and profiles
2. **interviewroles** - Custom interview roles and categories
3. **interviews** - Interview sessions and results (will be created when needed)

## 🚀 How to Use

### 1. Start the System
```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend  
cd frontend
npm run dev
```

### 2. Register First User
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Create your account
4. Login with your credentials

### 3. Create Interview Roles
1. Go to "Interview Roles" in sidebar
2. View default roles (Frontend, Backend, Full Stack, DevOps, Data Scientist)
3. Add custom roles with AI prompts

### 4. Start AI-Powered Interview
1. Go to "Interviews" → "New Interview"
2. Select role, category, difficulty
3. AI generates questions dynamically
4. Get real-time AI evaluation

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### InterviewRoles Collection
```javascript
{
  _id: ObjectId,
  name: String, // e.g., "Frontend Developer"
  description: String,
  categories: [{
    name: String, // e.g., "Technical", "Behavioral"
    description: String,
    aiPrompt: String // Custom AI prompt for question generation
  }],
  createdBy: ObjectId (optional, references User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Interviews Collection (created dynamically)
```javascript
{
  _id: ObjectId,
  user: ObjectId (references User),
  role: String,
  category: String,
  difficulty: String,
  status: String,
  questions: Array,
  answers: Array,
  score: Number,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration Files

### Backend (.env)
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

## 🎯 Features Enabled

### ✅ Authentication
- User registration and login
- JWT token-based authentication
- Protected routes

### ✅ Interview Management
- Custom interview roles
- Dynamic categories
- AI-powered question generation
- Real-time answer evaluation

### ✅ Database Operations
- MongoDB connection
- Mongoose ODM
- Data validation
- Error handling

## 🔄 Database Operations

### Add New Interview Role
```javascript
// Via API
POST /api/interview-roles
{
  "name": "Product Manager",
  "description": "Product management roles",
  "categories": [{
    "name": "Strategy",
    "description": "Strategic thinking questions",
    "aiPrompt": "Generate questions about product strategy..."
  }]
}
```

### Get User Interviews
```javascript
GET /api/interviews
// Returns all interviews for authenticated user
```

### Create New Interview
```javascript
POST /api/interviews
{
  "role": "Frontend Developer",
  "category": "Technical",
  "difficulty": "medium",
  "questionCount": 5
}
```

## 🛠️ Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community

# Check connection
mongosh --eval "db.adminCommand('ismaster')"
```

### Backend Issues
```bash
# Check port usage
lsof -ti:5001

# Kill process on port
kill <PID>

# Restart backend
npm start
```

### Frontend Issues
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

## 🎉 Success Indicators

✅ MongoDB running on localhost:27017  
✅ Backend connected to database  
✅ Default interview roles created  
✅ Frontend configured for real API  
✅ Authentication system working  
✅ AI features ready (with API keys)  

## 🚀 Next Steps

1. **Test Registration**: Create a new user account
2. **Explore Roles**: Check default interview roles
3. **Create Interview**: Start your first AI-powered interview
4. **Add AI Keys**: Configure OpenAI/Anthropic for full AI features
5. **Customize**: Add your own interview roles and categories

The system is now fully connected to MongoDB and ready for production use!
