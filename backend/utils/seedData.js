const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');
const ActivityLog = require('../models/ActivityLog');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await InterviewSession.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Sample interview questions
    const sampleQuestions = [
      {
        questionText: 'What is the difference between let, const, and var in JavaScript?',
        userAnswer: 'let and const are block-scoped while var is function-scoped. const cannot be reassigned.',
        score: 85,
        feedback: 'Good answer! You covered the main differences. Could also mention temporal dead zone.',
        category: 'Technical',
        difficulty: 'Easy'
      },
      {
        questionText: 'Explain the concept of closures in JavaScript.',
        userAnswer: 'Closures allow functions to access variables from their outer scope even after the outer function has returned.',
        score: 75,
        feedback: 'Correct definition. Try providing a practical example to demonstrate understanding.',
        category: 'Technical',
        difficulty: 'Medium'
      },
      {
        questionText: 'Tell me about a time you faced a challenging bug.',
        userAnswer: 'I once faced a memory leak in a React application. I used Chrome DevTools to identify the issue and fixed it by properly cleaning up event listeners.',
        score: 90,
        feedback: 'Excellent STAR method response. Clear problem, action, and result.',
        category: 'Behavioral',
        difficulty: 'Medium'
      }
    ];

    // Create sample interview sessions
    const interviews = [
      {
        userId: createdUsers[0]._id,
        role: 'Frontend Developer',
        category: 'Technical',
        status: 'completed',
        duration: 45,
        questions: sampleQuestions,
        tags: ['javascript', 'react', 'frontend'],
        aiInsights: {
          strengths: ['Strong JavaScript fundamentals', 'Good problem-solving approach'],
          weaknesses: ['Could improve on advanced concepts'],
          recommendations: ['Practice more complex algorithms', 'Study design patterns'],
          overallFeedback: 'Good performance with room for improvement.'
        }
      },
      {
        userId: createdUsers[0]._id,
        role: 'Full Stack Developer',
        category: 'Mixed',
        status: 'completed',
        duration: 60,
        questions: sampleQuestions.slice(0, 2),
        tags: ['fullstack', 'nodejs', 'react'],
        aiInsights: {
          strengths: ['Balanced technical knowledge'],
          weaknesses: ['Backend knowledge needs improvement'],
          recommendations: ['Focus on database design', 'Practice API development'],
          overallFeedback: 'Decent performance, needs more backend practice.'
        }
      },
      {
        userId: createdUsers[1]._id,
        role: 'Backend Developer',
        category: 'System Design',
        status: 'in-progress',
        duration: 30,
        questions: sampleQuestions.slice(0, 1),
        tags: ['backend', 'database', 'api']
      }
    ];

    const createdInterviews = await InterviewSession.create(interviews);
    console.log(`Created ${createdInterviews.length} interview sessions`);

    // Create sample activity logs
    const activities = [
      {
        userId: createdUsers[0]._id,
        sessionId: createdInterviews[0]._id,
        action: 'created',
        details: { role: 'Frontend Developer', category: 'Technical' }
      },
      {
        userId: createdUsers[0]._id,
        sessionId: createdInterviews[0]._id,
        action: 'completed',
        details: { score: 83, duration: 45 }
      },
      {
        userId: createdUsers[0]._id,
        sessionId: createdInterviews[1]._id,
        action: 'created',
        details: { role: 'Full Stack Developer', category: 'Mixed' }
      },
      {
        userId: createdUsers[1]._id,
        sessionId: createdInterviews[2]._id,
        action: 'created',
        details: { role: 'Backend Developer', category: 'System Design' }
      }
    ];

    await ActivityLog.create(activities);
    console.log(`Created ${activities.length} activity logs`);

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
