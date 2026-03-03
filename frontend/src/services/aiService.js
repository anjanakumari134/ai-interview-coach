import api from './api';

export const aiService = {
  getInterviewRoles: async () => {
    const response = await api.get('/interview-roles');
    return response.data;
  },
  createInterviewRole: async (roleData) => {
    const response = await api.post('/interview-roles', roleData);
    return response.data;
  },
  updateInterviewRole: async (id, roleData) => {
    const response = await api.put(`/interview-roles/${id}`, roleData);
    return response.data;
  },
  deleteInterviewRole: async (id) => {
    const response = await api.delete(`/interview-roles/${id}`);
    return response.data;
  },
  generateQuestions: async (roleId, categoryId, difficulty, count = 5) => {
    const response = await api.post('/interview-roles/generate-questions', {
      roleId,
      categoryId,
      difficulty,
      count
    });
    return response.data;
  },
  evaluateAnswer: async (question, answer, role, category) => {
    const response = await api.post('/interview-roles/evaluate-answer', {
      question,
      answer,
      role,
      category
    });
    return response.data;
  }
};
