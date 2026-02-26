import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import { aiService } from '../services/aiService';
import {
  Clock,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Setup form states
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const [selectedDifficulty, setSelectedDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(5);
  
  const timerRef = useRef(null);

  // Mock interview questions for different roles and categories
  const mockQuestions = {
    'Frontend Developer': {
      Technical: [
        {
          id: 1,
          question: "Explain the concept of virtual DOM in React and how it improves performance.",
          type: "technical",
          difficulty: "medium",
          timeLimit: 300,
          sampleAnswer: "Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory..."
        },
        {
          id: 2,
          question: "What are the key differences between let, const, and var in JavaScript?",
          type: "technical",
          difficulty: "easy",
          timeLimit: 180,
          sampleAnswer: "let allows reassignment and has block scope, const is for constants with block scope, var has function scope..."
        },
        {
          id: 3,
          question: "How would you optimize a React component that's rendering slowly?",
          type: "technical",
          difficulty: "hard",
          timeLimit: 420,
          sampleAnswer: "I would use React.memo, useMemo, useCallback, and implement virtual scrolling..."
        },
        {
          id: 4,
          question: "Explain CSS Grid vs Flexbox and when to use each.",
          type: "technical",
          difficulty: "medium",
          timeLimit: 240,
          sampleAnswer: "CSS Grid is for two-dimensional layouts, Flexbox is for one-dimensional layouts..."
        },
        {
          id: 5,
          question: "What is the difference between controlled and uncontrolled components in React?",
          type: "technical",
          difficulty: "easy",
          timeLimit: 180,
          sampleAnswer: "Controlled components are controlled by React state, uncontrolled components maintain their own state..."
        }
      ],
      Behavioral: [
        {
          id: 6,
          question: "Tell me about a time you had to work with a difficult team member.",
          type: "behavioral",
          difficulty: "medium",
          timeLimit: 240,
          sampleAnswer: "In my previous project, I worked with a team member who had different coding standards..."
        },
        {
          id: 7,
          question: "How do you stay updated with the latest frontend technologies?",
          type: "behavioral",
          difficulty: "easy",
          timeLimit: 180,
          sampleAnswer: "I follow industry blogs, attend conferences, and work on side projects..."
        }
      ]
    },
    'Backend Developer': {
      Technical: [
        {
          id: 8,
          question: "Explain database indexing and when you would use different types of indexes.",
          type: "technical",
          difficulty: "medium",
          timeLimit: 300,
          sampleAnswer: "Database indexing creates data structures to improve query performance..."
        },
        {
          id: 9,
          question: "What is the difference between SQL and NoSQL databases?",
          type: "technical",
          difficulty: "easy",
          timeLimit: 180,
          sampleAnswer: "SQL databases are relational, NoSQL databases are non-relational..."
        },
        {
          id: 10,
          question: "How would you handle authentication and authorization in a REST API?",
          type: "technical",
          difficulty: "hard",
          timeLimit: 360,
          sampleAnswer: "I would use JWT for authentication, implement role-based access control..."
        }
      ],
      Behavioral: [
        {
          id: 11,
          question: "Describe a time when you had to optimize a slow database query.",
          type: "behavioral",
          difficulty: "medium",
          timeLimit: 240,
          sampleAnswer: "I analyzed the query execution plan, added appropriate indexes, and rewrote the query..."
        }
      ]
    },
    'Full Stack Developer': {
      Technical: [
        {
          id: 12,
          question: "How would you design a scalable microservices architecture?",
          type: "technical",
          difficulty: "hard",
          timeLimit: 420,
          sampleAnswer: "I would break down the application into domain-driven services, use API gateways..."
        },
        {
          id: 13,
          question: "Explain the concept of CI/CD and how you would implement it.",
          type: "technical",
          difficulty: "medium",
          timeLimit: 300,
          sampleAnswer: "CI/CD is the practice of automating integration and deployment..."
        }
      ],
      Behavioral: [
        {
          id: 14,
          question: "How do you approach debugging complex full-stack issues?",
          type: "behavioral",
          difficulty: "medium",
          timeLimit: 240,
          sampleAnswer: "I start by reproducing the issue, then isolate whether it's frontend or backend..."
        }
      ]
    },
    'DevOps Engineer': {
      Technical: [
        {
          id: 15,
          question: "Explain Docker containers and their benefits over virtual machines.",
          type: "technical",
          difficulty: "medium",
          timeLimit: 300,
          sampleAnswer: "Docker containers are lightweight, share host OS kernel, and start faster..."
        },
        {
          id: 16,
          question: "How would you implement a zero-downtime deployment strategy?",
          type: "technical",
          difficulty: "hard",
          timeLimit: 360,
          sampleAnswer: "I would use blue-green deployment, canary releases, or rolling updates..."
        }
      ],
      Behavioral: [
        {
          id: 17,
          question: "Tell me about a time you improved deployment reliability.",
          type: "behavioral",
          difficulty: "medium",
          timeLimit: 240,
          sampleAnswer: "I implemented automated testing and monitoring in the deployment pipeline..."
        }
      ]
    },
    'Data Scientist': {
      Technical: [
        {
          id: 18,
          question: "Explain the difference between supervised and unsupervised learning.",
          type: "technical",
          difficulty: "easy",
          timeLimit: 180,
          sampleAnswer: "Supervised learning uses labeled data, unsupervised learning finds patterns in unlabeled data..."
        },
        {
          id: 19,
          question: "How would you handle missing data in a dataset?",
          type: "technical",
          difficulty: "medium",
          timeLimit: 240,
          sampleAnswer: "I would analyze the pattern of missing data, then use imputation or removal strategies..."
        }
      ],
      Behavioral: [
        {
          id: 20,
          question: "Describe a machine learning project you worked on from start to finish.",
          type: "behavioral",
          difficulty: "medium",
          timeLimit: 300,
          sampleAnswer: "I worked on a customer churn prediction project, from data collection to deployment..."
        }
      ]
    }
  };

  // Helper function to get questions based on selection
  const getQuestionsForInterview = () => {
    const roleQuestions = mockQuestions[selectedRole]?.[selectedCategory] || [];
    let filteredQuestions = roleQuestions;

    // Filter by difficulty if not mixed
    if (selectedDifficulty !== 'mixed') {
      filteredQuestions = roleQuestions.filter(q => q.difficulty === selectedDifficulty);
    }

    // Shuffle and limit to questionCount
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  };

  const setupInterview = async () => {
    try {
      toast.loading('Generating AI questions...', { id: 'generate-questions' });
      
      // Generate questions using AI
      const response = await aiService.generateQuestions(
        'frontend-developer', // Will be updated when we have role selection from database
        selectedCategory.toLowerCase(),
        selectedDifficulty,
        questionCount
      );
      
      toast.dismiss('generate-questions');
      
      const newInterview = {
        _id: 'new',
        role: selectedRole,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        status: 'in-progress',
        questions: response.data,
        createdAt: new Date().toISOString(),
      };
      
      setInterview(newInterview);
      setIsStarted(true);
      toast.success('AI questions generated! Interview starting...');
    } catch (error) {
      toast.dismiss('generate-questions');
      toast.error('Failed to generate AI questions. Using fallback questions.');
      
      // Fallback to mock questions
      const selectedQuestions = getQuestionsForInterview();
      
      const newInterview = {
        _id: 'new',
        role: selectedRole,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        status: 'in-progress',
        questions: selectedQuestions,
        createdAt: new Date().toISOString(),
      };
      
      setInterview(newInterview);
      setIsStarted(true);
    }
  };

  useEffect(() => {
    if (id === 'new') {
      // Don't auto-create interview, wait for user setup
      return;
    } else {
      // Load existing interview
      loadInterview(id);
    }
  }, [id]);

  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isStarted) {
      completeInterview();
    }

    return () => clearTimeout(timerRef.current);
  }, [timeRemaining, isStarted]);

  const loadInterview = async (interviewId) => {
    try {
      const response = await interviewAPI.getInterview(interviewId);
      setInterview(response.data);
    } catch (error) {
      toast.error('Failed to load interview');
      navigate('/interviews');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording simulation
      setIsRecording(true);
      setIsTranscribing(true);
      
      // Simulate transcription after 2 seconds
      setTimeout(() => {
        const mockTranscription = generateMockAnswer();
        setCurrentAnswer(mockTranscription);
        setIsTranscribing(false);
      }, 2000);
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  const generateMockAnswer = () => {
    const currentQ = interview?.questions[currentQuestionIndex];
    if (!currentQ) return '';
    
    const answers = [
      "That's a great question. Based on my experience, I would say that...",
      "From my understanding, the key points to consider are...",
      "I believe the best approach would be to first analyze the requirements...",
      "In my previous projects, I've encountered similar situations where...",
    ];
    
    return answers[Math.floor(Math.random() * answers.length)] + " " + 
           currentQ.sampleAnswer?.substring(0, 100) + "...";
  };

  const nextQuestion = async () => {
    const newAnswers = [...answers];
    
    // Evaluate answer using AI if we have one
    let evaluation = null;
    if (currentAnswer.trim()) {
      try {
        toast.loading('AI evaluating your answer...', { id: 'evaluate-answer' });
        const evaluationResponse = await aiService.evaluateAnswer(
          currentQuestion.question,
          currentAnswer,
          interview.role,
          interview.category
        );
        toast.dismiss('evaluate-answer');
        evaluation = evaluationResponse.data;
        toast.success('Answer evaluated!');
      } catch (error) {
        toast.dismiss('evaluate-answer');
        console.error('AI evaluation failed:', error);
      }
    }
    
    newAnswers[currentQuestionIndex] = {
      questionId: interview.questions[currentQuestionIndex].id,
      answer: currentAnswer,
      evaluation,
      timeSpent: 300 - (interview.questions[currentQuestionIndex].timeLimit || 300),
      timestamp: new Date().toISOString(),
    };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      completeInterview();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(answers[currentQuestionIndex - 1]?.answer || '');
    }
  };

  const completeInterview = async () => {
    setIsCompleted(true);
    
    // Calculate mock scores
    const totalQuestions = interview.questions.length;
    const answeredQuestions = answers.filter(a => a.answer).length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Mock scoring based on answer length and keywords
    let totalScore = 0;
    answers.forEach((answer, index) => {
      if (answer.answer) {
        const question = interview.questions[index];
        let score = 60; // Base score
        
        // Add points for longer answers
        if (answer.answer.length > 100) score += 10;
        if (answer.answer.length > 200) score += 10;
        
        // Add points for keywords
        const keywords = ['component', 'function', 'database', 'api', 'react', 'javascript'];
        const foundKeywords = keywords.filter(keyword => 
          answer.answer.toLowerCase().includes(keyword)
        ).length;
        score += foundKeywords * 5;
        
        totalScore += Math.min(score, 100);
      }
    });
    
    const averageScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
    
    try {
      if (id !== 'new') {
        await interviewAPI.updateInterview(interview._id, {
          status: 'completed',
          totalScore: averageScore,
          answers: answers,
          completedAt: new Date().toISOString(),
        });
      }
      
      toast.success(`Interview completed! Your score: ${averageScore}%`);
      setTimeout(() => {
        navigate('/interviews');
      }, 3000);
    } catch (error) {
      toast.error('Failed to save interview results');
    }
  };

  if (!interview) {
    // Show setup form for new interview
    if (id === 'new') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Setup Your Mock Interview
            </h1>
            
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Technical">Technical Questions</option>
                  <option value="Behavioral">Behavioral Questions</option>
                </select>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`p-3 rounded-lg border capitalize transition-colors ${
                        selectedDifficulty === difficulty
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedDifficulty('mixed')}
                    className={`p-3 rounded-lg border capitalize transition-colors col-span-3 ${
                      selectedDifficulty === 'mixed'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Mixed Difficulty
                  </button>
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions: {questionCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 questions</span>
                  <span>10 questions</span>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Interview Preview</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Role:</strong> {selectedRole}</p>
                  <p><strong>Category:</strong> {selectedCategory}</p>
                  <p><strong>Difficulty:</strong> {selectedDifficulty}</p>
                  <p><strong>Questions:</strong> {questionCount}</p>
                  <p><strong>Duration:</strong> ~{Math.ceil(questionCount * 4)} minutes</p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={setupInterview}
                className="w-full btn btn-primary"
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Loading existing interview
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {interview.role} - {interview.category} Interview
            </h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`}>
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  {currentQuestion.type} Question
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Area */}
            {isStarted && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Your Answer
                    </label>
                    <div className="flex items-center space-x-2">
                      {isTranscribing && (
                        <span className="text-sm text-blue-600">Transcribing...</span>
                      )}
                      <button
                        onClick={toggleRecording}
                        className={`flex items-center px-3 py-1 rounded-md text-sm ${
                          isRecording 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-1" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-1" />
                            Start Recording
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Click 'Start Recording' for voice input or type your answer here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={!isStarted}
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="btn btn-secondary disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={!currentAnswer.trim()}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {currentQuestionIndex === interview.questions.length - 1 ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Interview
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Progress</h3>
            <div className="space-y-2">
              {interview.questions.map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    index === currentQuestionIndex
                      ? 'bg-primary-100 border border-primary-300'
                      : index < currentQuestionIndex
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">
                    Question {index + 1}
                  </span>
                  {index < currentQuestionIndex && answers[index] ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : index === currentQuestionIndex ? (
                    <Clock className="h-4 w-4 text-primary-600" />
                  ) : (
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Interview Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Structure your answer with examples</li>
              <li>• Use the STAR method for behavioral questions</li>
              <li>• It's okay to take a moment to think</li>
              <li>• Be specific and provide concrete examples</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interview Completed!
              </h3>
              <p className="text-gray-600 mb-4">
                Great job! Your responses have been saved.
              </p>
              <button
                onClick={() => navigate('/interviews')}
                className="btn btn-primary w-full"
              >
                View All Interviews
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
