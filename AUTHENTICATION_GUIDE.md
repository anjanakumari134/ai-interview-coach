# MongoDB Authentication Guide

## 🎯 Overview
This guide explains how the MongoDB-based authentication system works in the AI Interview Coach application.

## ✅ Authentication Features

### User Registration
- **Email Validation**: Unique email addresses with format validation
- **Password Security**: Bcrypt hashing with salt (12 rounds)
- **Password Requirements**: 
  - Minimum 6 characters
  - At least one uppercase letter
  - At least one lowercase letter  
  - At least one number
- **User Roles**: User and Admin roles
- **Activity Logging**: Registration events tracked

### User Login
- **JWT Authentication**: Secure token-based authentication
- **Token Expiration**: 7 days by default
- **Password Verification**: Secure bcrypt comparison
- **Session Management**: Activity tracking for login events

### Security Features
- **Password Hashing**: Automatic bcrypt hashing before saving
- **Password Protection**: Password excluded from JSON responses
- **Input Validation**: Express-validator for form validation
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Cross-origin request security

## 📊 MongoDB Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String (default: ''),
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Logs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  sessionId: ObjectId,
  action: String (e.g., 'created', 'login', 'logout'),
  details: Object (action-specific data),
  timestamp: Date
}
```

## 🔧 API Endpoints

### POST /api/auth/register
**Purpose**: Register a new user

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "69a00148c81e8e45615ad606",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### POST /api/auth/login
**Purpose**: Authenticate existing user

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "69a00148c81e8e45615ad606",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### GET /api/auth/me
**Purpose**: Get current user profile

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "69a00148c81e8e45615ad606",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": ""
  }
}
```

## 🛠️ Implementation Details

### Password Hashing
```javascript
// Automatic hashing before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Password Comparison
```javascript
// Secure password verification
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### JWT Token Generation
```javascript
// Middleware for token generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
```

### Authentication Middleware
```javascript
// Protect routes with JWT verification
const auth = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token failed' });
  }
};
```

## 🧪 Testing Authentication

### Register New User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123456"}'
```

### Login User
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

### Get User Profile
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔍 Database Verification

### Check Users in MongoDB
```bash
mongosh ai-interview-coach --eval "db.users.find({}, {password: 0}).pretty()"
```

### Check Activity Logs
```bash
mongosh ai-interview-coach --eval "db.activitylogs.find().pretty()"
```

### Count Users
```bash
mongosh ai-interview-coach --eval "db.users.countDocuments()"
```

## 🚀 Frontend Integration

### Auth Context
```javascript
// React context for authentication state
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Login Function
```javascript
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};
```

### Registration Function
```javascript
const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};
```

## 🔒 Security Best Practices

1. **Password Requirements**: Enforce strong password policies
2. **Token Expiration**: Set reasonable JWT expiration times
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Keep secrets in .env files
5. **Input Validation**: Validate all user inputs
6. **Rate Limiting**: Prevent brute force attacks
7. **Activity Logging**: Track authentication events

## 🎉 Success Indicators

✅ **User Registration**: New users can create accounts  
✅ **User Login**: Existing users can authenticate  
✅ **Token Generation**: JWT tokens created successfully  
✅ **Password Security**: Passwords hashed with bcrypt  
✅ **Database Storage**: User data stored in MongoDB  
✅ **Activity Tracking**: Login/registration events logged  
✅ **API Protection**: Routes secured with authentication middleware  

The MongoDB authentication system is fully functional and ready for production use!
