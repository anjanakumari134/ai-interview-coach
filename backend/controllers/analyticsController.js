const InterviewSession = require('../models/InterviewSession');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get user analytics
// @route   GET /api/analytics
// @access  Private
const getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total interviews
    const totalInterviews = await InterviewSession.countDocuments({ userId });

    // Completed interviews
    const completedInterviews = await InterviewSession.countDocuments({ 
      userId, 
      status: 'completed' 
    });

    // Average score
    const scoreStats = await InterviewSession.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$totalScore' },
          maxScore: { $max: '$totalScore' },
          minScore: { $min: '$totalScore' }
        }
      }
    ]);

    // Performance by category
    const categoryStats = await InterviewSession.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $group: {
          _id: '$category',
          avgScore: { $avg: '$totalScore' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    // Performance by role
    const roleStats = await InterviewSession.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $group: {
          _id: '$role',
          avgScore: { $avg: '$totalScore' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await InterviewSession.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('role totalScore category createdAt status');

    // Progress over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const progressData = await InterviewSession.aggregate([
      {
        $match: {
          userId,
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          avgScore: { $avg: '$totalScore' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Weak categories (categories with avg score < 60)
    const weakCategories = categoryStats
      .filter(cat => cat.avgScore < 60)
      .map(cat => ({
        category: cat._id,
        avgScore: Math.round(cat.avgScore),
        improvement: 'Focus more on this area'
      }));

    // Generate AI insights
    const insights = generateInsights({
      totalInterviews,
      completedInterviews,
      scoreStats: scoreStats[0] || { avgScore: 0, maxScore: 0, minScore: 0 },
      categoryStats,
      roleStats,
      weakCategories
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalInterviews,
          completedInterviews,
          completionRate: totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0,
          avgScore: scoreStats[0] ? Math.round(scoreStats[0].avgScore) : 0,
          highestScore: scoreStats[0] ? scoreStats[0].maxScore : 0,
          lowestScore: scoreStats[0] ? scoreStats[0].minScore : 0
        },
        categoryPerformance: categoryStats.map(cat => ({
          category: cat._id,
          avgScore: Math.round(cat.avgScore),
          interviewsCount: cat.count
        })),
        rolePerformance: roleStats.map(role => ({
          role: role._id,
          avgScore: Math.round(role.avgScore),
          interviewsCount: role.count
        })),
        progressOverTime: progressData.map(data => ({
          month: `${data._id.year}-${String(data._id.month).padStart(2, '0')}`,
          avgScore: Math.round(data.avgScore),
          interviewsCount: data.count
        })),
        weakCategories,
        recentActivity,
        insights
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate AI insights
const generateInsights = (data) => {
  const insights = [];
  const { totalInterviews, scoreStats, categoryStats, weakCategories } = data;

  if (totalInterviews === 0) {
    return ['Start your first interview practice to begin tracking your progress!'];
  }

  // Performance insights
  if (scoreStats.avgScore >= 80) {
    insights.push('Excellent performance! You consistently score high in interviews.');
  } else if (scoreStats.avgScore >= 60) {
    insights.push('Good performance with room for improvement. Keep practicing!');
  } else {
    insights.push('Focus on understanding core concepts and practice more questions.');
  }

  // Category insights
  const bestCategory = categoryStats.reduce((best, current) => 
    current.avgScore > best.avgScore ? current : best, categoryStats[0]);
  
  if (bestCategory) {
    insights.push(`You perform best in ${bestCategory._id} interviews.`);
  }

  // Weakness insights
  if (weakCategories.length > 0) {
    insights.push(`Consider focusing more on: ${weakCategories.map(w => w.category).join(', ')}`);
  }

  // Progress insights
  if (totalInterviews >= 5) {
    insights.push(`Great consistency! You've completed ${totalInterviews} interviews.`);
  }

  // Specific recommendations
  if (scoreStats.maxScore - scoreStats.minScore > 30) {
    insights.push('Your performance varies significantly. Work on consistency across different topics.');
  }

  return insights;
};

module.exports = {
  getUserAnalytics
};
