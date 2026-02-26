const axios = require('axios');

class AIService {
  constructor() {
    // You can configure this to use OpenAI, Claude, or other AI services
    this.apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    this.baseURL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1';
  }

  async generateQuestions(role, category, difficulty, count = 5) {
    try {
      const prompt = `Generate ${count} interview questions for a ${role} position.
      
Category: ${category}
Difficulty: ${difficulty}

Please provide questions in the following JSON format:
[
  {
    "question": "The actual question text",
    "type": "technical|behavioral",
    "difficulty": "easy|medium|hard",
    "timeLimit": 300,
    "sampleAnswer": "A brief sample answer outline"
  }
]

Requirements:
- Questions should be realistic and challenging
- Technical questions should test practical knowledge
- Behavioral questions should assess soft skills
- Time limits should be appropriate for question complexity
- Include a mix of problem-solving and conceptual questions
- Make questions specific to ${role} role`;

      const response = await this.callAI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to mock questions if AI fails
      return this.getFallbackQuestions(role, category, difficulty, count);
    }
  }

  async evaluateAnswer(question, answer, role, category) {
    try {
      const prompt = `Evaluate the following interview answer:

Role: ${role}
Category: ${category}
Question: ${question}
Answer: ${answer}

Please provide evaluation in this JSON format:
{
  "score": 85,
  "feedback": "Detailed feedback on the answer",
  "strengths": ["List of strengths"],
  "improvements": ["List of areas to improve"],
  "suggestedAnswer": "A model answer for comparison"
}

Evaluation criteria:
- Technical accuracy
- Clarity and communication
- Problem-solving approach
- Relevance to the question
- Depth of knowledge`;

      const response = await this.callAI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Fallback evaluation
      return this.getFallbackEvaluation(answer);
    }
  }

  async callAI(prompt) {
    try {
      // Using OpenAI API as example
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach and technical interviewer. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  }

  parseAIResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw error;
    }
  }

  getFallbackQuestions(role, category, difficulty, count) {
    // Fallback questions when AI is not available
    const fallbackQuestions = {
      'Frontend Developer': {
        'Technical': [
          {
            question: "Explain the concept of virtual DOM in React and how it improves performance.",
            type: "technical",
            difficulty: "medium",
            timeLimit: 300,
            sampleAnswer: "Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory..."
          },
          {
            question: "What are the key differences between let, const, and var in JavaScript?",
            type: "technical",
            difficulty: "easy",
            timeLimit: 180,
            sampleAnswer: "let allows reassignment and has block scope, const is for constants with block scope..."
          }
        ],
        'Behavioral': [
          {
            question: "Tell me about a time you had to work with a difficult team member.",
            type: "behavioral",
            difficulty: "medium",
            timeLimit: 240,
            sampleAnswer: "In my previous project, I worked with a team member who had different coding standards..."
          }
        ]
      }
    };

    const questions = fallbackQuestions[role]?.[category] || [];
    return questions.slice(0, count);
  }

  getFallbackEvaluation(answer) {
    // Simple fallback evaluation based on answer length and keywords
    let score = 60; // Base score
    
    if (answer.length > 100) score += 10;
    if (answer.length > 200) score += 10;
    
    const technicalKeywords = ['component', 'function', 'database', 'api', 'react', 'javascript'];
    const foundKeywords = technicalKeywords.filter(keyword => 
      answer.toLowerCase().includes(keyword)
    ).length;
    score += foundKeywords * 5;
    
    return {
      score: Math.min(score, 100),
      feedback: "Answer received. AI evaluation temporarily unavailable.",
      strengths: ["Provided a response"],
      improvements: ["Add more technical details", "Include specific examples"],
      suggestedAnswer: "A comprehensive answer would include technical details and specific examples."
    };
  }
}

module.exports = new AIService();
