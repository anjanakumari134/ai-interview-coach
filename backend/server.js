const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set. Ensure backend/.env exists and is loaded.');
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Authentication will fail without it.');
}
connectDB();

const app = express();
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5176', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/interview-roles', require('./routes/interviewRoles'));
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
