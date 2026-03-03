# AI Interview Coach Platform

A comprehensive full-stack web application for practicing and improving interview skills with AI-generated insights and performance tracking.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based secure login/registration system
- **Interview Sessions**: Create, update, and track practice interviews
- **AI Insights**: Get personalized feedback and performance recommendations
- **Analytics Dashboard**: Visualize progress with charts and metrics
- **Activity Tracking**: Monitor all user actions and history
- **Search & Filter**: Find interviews by role, category, or status
- **Responsive Design**: Mobile-first UI with Tailwind CSS

### Technical Features
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **State Management**: React Query + Context API
- **Charts**: Recharts for data visualization
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Express-validator + frontend form validation
- **Error Handling**: Global error middleware
- **Rate Limiting**: API protection
- **Pagination**: Efficient data loading

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ai-interview-coach
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```bash
cd frontend
touch .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
cd backend
npm run seed
```

## 🚀 Running the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
ai-interview-coach/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── interviewController.js # Interview CRUD
│   │   ├── analyticsController.js # Analytics data
│   │   └── activityController.js  # Activity logging
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── InterviewSession.js  # Interview schema
│   │   └── ActivityLog.js       # Activity schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── interviews.js        # Interview routes
│   │   ├── analytics.js         # Analytics routes
│   │   └── activity.js          # Activity routes
│   ├── utils/
│   │   └── seedData.js          # Database seeding
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Main layout component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Interviews.jsx   # Interview management
│   │   │   ├── Analytics.jsx    # Analytics dashboard
│   │   │   └── Activity.jsx     # Activity history
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.jsx              # Main App component
│   │   ├── index.css            # Tailwind CSS
│   │   └── main.jsx             # App entry point
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── vite.config.js           # Vite configuration
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Interviews
- `GET /api/interviews` - Get user interviews (with pagination/filtering)
- `POST /api/interviews` - Create new interview
- `GET /api/interviews/:id` - Get single interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview

### Analytics
- `GET /api/analytics` - Get user analytics and insights

### Activity
- `GET /api/activity` - Get user activity logs

## 🎯 Usage

### 1. Register/Login
- Create an account or login with existing credentials
- Demo credentials: `john@example.com` / `password123`

### 2. Create Interview Session
- Select role (Frontend, Backend, Full Stack, etc.)
- Choose category (Technical, Behavioral, System Design)
- Set duration and start practicing

### 3. Track Progress
- View performance metrics on the dashboard
- Analyze trends with charts and graphs
- Get AI-powered insights and recommendations

### 4. Manage Sessions
- Search, filter, and sort interview history
- Update or delete old sessions
- Monitor activity logs

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure MongoDB is accessible in production

### Frontend Deployment
1. Build the application:
```bash
cd frontend
npm run build
```
2. Deploy the `dist` folder to your hosting service

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
VITE_API_URL=your-production-api-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`

3. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check API URL in frontend `.env`

4. **Tailwind CSS Not Working**
   - Run `npm install` in frontend directory
   - Check PostCSS configuration

### Support

For support, please open an issue in the repository or contact the development team.

## 🎉 Acknowledgments

- Built with React, Node.js, and MongoDB
- UI components styled with Tailwind CSS
- Charts powered by Recharts
- Icons from Lucide React
