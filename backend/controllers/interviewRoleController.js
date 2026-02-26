const InterviewRole = require('../models/InterviewRole');
const aiService = require('../services/aiService');

// Get all interview roles
const getInterviewRoles = async (req, res) => {
  try {
    const roles = await InterviewRole.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interview roles',
      error: error.message
    });
  }
};

// Create new interview role
const createInterviewRole = async (req, res) => {
  try {
    const { name, description, categories } = req.body;
    
    const interviewRole = new InterviewRole({
      name,
      description,
      categories,
      createdBy: req.user.id
    });
    
    await interviewRole.save();
    
    res.status(201).json({
      success: true,
      data: interviewRole,
      message: 'Interview role created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating interview role',
      error: error.message
    });
  }
};

// Update interview role
const updateInterviewRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categories, isActive } = req.body;
    
    const interviewRole = await InterviewRole.findByIdAndUpdate(
      id,
      { name, description, categories, isActive },
      { new: true, runValidators: true }
    );
    
    if (!interviewRole) {
      return res.status(404).json({
        success: false,
        message: 'Interview role not found'
      });
    }
    
    res.json({
      success: true,
      data: interviewRole,
      message: 'Interview role updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating interview role',
      error: error.message
    });
  }
};

// Delete interview role
const deleteInterviewRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    const interviewRole = await InterviewRole.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!interviewRole) {
      return res.status(404).json({
        success: false,
        message: 'Interview role not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Interview role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting interview role',
      error: error.message
    });
  }
};

// Generate AI questions for a role and category
const generateAIQuestions = async (req, res) => {
  try {
    const { roleId, categoryId, difficulty, count = 5 } = req.body;
    
    const role = await InterviewRole.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Interview role not found'
      });
    }
    
    const category = role.categories.id(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const questions = await aiService.generateQuestions(
      role.name,
      category.name,
      difficulty,
      count
    );
    
    res.json({
      success: true,
      data: questions,
      message: 'Questions generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating questions',
      error: error.message
    });
  }
};

// Evaluate answer using AI
const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, role, category } = req.body;
    
    const evaluation = await aiService.evaluateAnswer(
      question,
      answer,
      role,
      category
    );
    
    res.json({
      success: true,
      data: evaluation,
      message: 'Answer evaluated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error evaluating answer',
      error: error.message
    });
  }
};

module.exports = {
  getInterviewRoles,
  createInterviewRole,
  updateInterviewRole,
  deleteInterviewRole,
  generateAIQuestions,
  evaluateAnswer
};
