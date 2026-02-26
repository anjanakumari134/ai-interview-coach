// Mock API for testing without backend
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In real app, this would be hashed
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

const mockInterviews = [
  {
    _id: '1',
    role: 'Frontend Developer',
    category: 'Technical',
    status: 'completed',
    totalScore: 85,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    role: 'Backend Developer',
    category: 'System Design',
    status: 'in-progress',
    totalScore: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockAnalytics = {
  overview: {
    totalInterviews: 2,
    avgScore: 85,
    highestScore: 85,
    completionRate: 50,
  },
  categoryPerformance: [
    { category: 'Technical', avgScore: 85 },
    { category: 'System Design', avgScore: 0 },
  ],
  rolePerformance: [
    { role: 'Frontend Developer', interviewsCount: 1 },
    { role: 'Backend Developer', interviewsCount: 1 },
  ],
  progressOverTime: [
    { month: 'Jan', avgScore: 0 },
    { month: 'Feb', avgScore: 85 },
  ],
  insights: [
    'You perform well in technical interviews',
    'Consider practicing more system design questions',
    'Your frontend skills are strong',
  ],
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    await delay(1000);
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      data: {
        user: { _id: user._id, name: user.name, email: user.email },
        token: 'mock-jwt-token',
      },
    };
  },

  register: async (userData) => {
    await delay(1000);
    const existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      _id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      password: userData.password,
    };
    
    mockUsers.push(newUser);
    
    return {
      data: {
        user: { _id: newUser._id, name: newUser.name, email: newUser.email },
        token: 'mock-jwt-token',
      },
    };
  },

  getMe: async () => {
    await delay(500);
    return {
      data: {
        user: { _id: '1', name: 'John Doe', email: 'john@example.com' },
      },
    };
  },

  // Interview endpoints
  getInterviews: async (filters = {}) => {
    await delay(800);
    return {
      data: {
        data: mockInterviews,
        pagination: {
          page: 1,
          pages: 1,
          total: mockInterviews.length,
          limit: 10,
        },
      },
    };
  },

  createInterview: async (interviewData) => {
    await delay(1000);
    const newInterview = {
      _id: String(mockInterviews.length + 1),
      role: interviewData.role || 'Frontend Developer',
      category: interviewData.category || 'Technical',
      status: 'in-progress',
      totalScore: null,
      createdAt: new Date().toISOString(),
    };
    mockInterviews.push(newInterview);
    return { data: newInterview };
  },

  updateInterview: async (id, interviewData) => {
    await delay(1000);
    const index = mockInterviews.findIndex(i => i._id === id);
    if (index === -1) {
      throw new Error('Interview not found');
    }
    mockInterviews[index] = { ...mockInterviews[index], ...interviewData };
    return { data: mockInterviews[index] };
  },

  deleteInterview: async (id) => {
    await delay(800);
    const index = mockInterviews.findIndex(i => i._id === id);
    if (index === -1) {
      throw new Error('Interview not found');
    }
    mockInterviews.splice(index, 1);
    return { data: { message: 'Interview deleted successfully' } };
  },

  // Analytics endpoint
  getAnalytics: async () => {
    await delay(1200);
    return { data: mockAnalytics };
  },
};

export default mockApi;
