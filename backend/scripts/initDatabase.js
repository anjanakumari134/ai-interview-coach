const mongoose = require('mongoose');
const User = require('../models/User');
const InterviewRole = require('../models/InterviewRole');
require('dotenv').config();

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create default interview roles
    const defaultRoles = [
      {
        name: 'Frontend Developer',
        description: 'Frontend development roles focusing on UI/UX and client-side technologies',
        categories: [
          {
            name: 'Technical',
            description: 'Technical questions about frontend technologies',
            aiPrompt: 'Generate technical interview questions for frontend developers that assess React, JavaScript, CSS, HTML, and modern frontend development skills'
          },
          {
            name: 'Behavioral',
            description: 'Behavioral questions about teamwork and problem-solving',
            aiPrompt: 'Generate behavioral interview questions for frontend developers that assess teamwork, communication, problem-solving, and project management skills'
          }
        ],
        createdBy: null, // Will be set to first admin user
        isActive: true
      },
      {
        name: 'Backend Developer',
        description: 'Backend development roles focusing on server-side technologies and databases',
        categories: [
          {
            name: 'Technical',
            description: 'Technical questions about backend technologies',
            aiPrompt: 'Generate technical interview questions for backend developers that assess Node.js, databases, APIs, system design, and server-side programming skills'
          },
          {
            name: 'Behavioral',
            description: 'Behavioral questions about system architecture and collaboration',
            aiPrompt: 'Generate behavioral interview questions for backend developers that assess system thinking, collaboration, code quality, and technical leadership skills'
          }
        ],
        createdBy: null,
        isActive: true
      },
      {
        name: 'Full Stack Developer',
        description: 'Full stack development roles requiring both frontend and backend skills',
        categories: [
          {
            name: 'Technical',
            description: 'Technical questions covering full stack technologies',
            aiPrompt: 'Generate technical interview questions for full stack developers that assess both frontend and backend skills, system integration, and end-to-end development'
          },
          {
            name: 'Behavioral',
            description: 'Behavioral questions about full stack development challenges',
            aiPrompt: 'Generate behavioral interview questions for full stack developers that assess project ownership, technical decision-making, and cross-functional collaboration'
          }
        ],
        createdBy: null,
        isActive: true
      },
      {
        name: 'DevOps Engineer',
        description: 'DevOps roles focusing on infrastructure, deployment, and operations',
        categories: [
          {
            name: 'Technical',
            description: 'Technical questions about DevOps tools and practices',
            aiPrompt: 'Generate technical interview questions for DevOps engineers that assess CI/CD, containerization, cloud services, monitoring, and infrastructure automation'
          },
          {
            name: 'Behavioral',
            description: 'Behavioral questions about operations and reliability',
            aiPrompt: 'Generate behavioral interview questions for DevOps engineers that assess incident management, reliability mindset, and collaboration with development teams'
          }
        ],
        createdBy: null,
        isActive: true
      },
      {
        name: 'Data Scientist',
        description: 'Data science roles focusing on machine learning and data analysis',
        categories: [
          {
            name: 'Technical',
            description: 'Technical questions about data science and machine learning',
            aiPrompt: 'Generate technical interview questions for data scientists that assess machine learning algorithms, statistics, data processing, and model evaluation'
          },
          {
            name: 'Behavioral',
            description: 'Behavioral questions about data-driven decision making',
            aiPrompt: 'Generate behavioral interview questions for data scientists that assess analytical thinking, communication of insights, and ethical considerations in data science'
          }
        ],
        createdBy: null,
        isActive: true
      }
    ];

    // Clear existing roles (optional - remove if you want to keep existing data)
    await InterviewRole.deleteMany({});
    console.log('Cleared existing interview roles');

    // Insert default roles
    const insertedRoles = await InterviewRole.insertMany(defaultRoles);
    console.log(`Created ${insertedRoles.length} default interview roles:`);
    insertedRoles.forEach(role => {
      console.log(`- ${role.name} with ${role.categories.length} categories`);
    });

    // Check if any users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found. You can create users through the registration page.');
    } else {
      console.log(`Found ${userCount} existing users in the database.`);
    }

    console.log('\nDatabase initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm start');
    console.log('2. Start the frontend server: npm run dev');
    console.log('3. Register a new user through the frontend');
    console.log('4. Create interviews and test the system');

  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the initialization
initDatabase();
