const ActivityLog = require('../models/ActivityLog');

// @desc    Get user activity logs
// @route   GET /api/activity
// @access  Private
const getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: req.user.id };

    // Filter by action type
    if (req.query.action) {
      query.action = req.query.action;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.timestamp = {};
      if (req.query.startDate) {
        query.timestamp.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.timestamp.$lte = new Date(req.query.endDate);
      }
    }

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sessionId', 'role category totalScore')
      .populate('userId', 'name email');

    const total = await ActivityLog.countDocuments(query);

    // Activity statistics
    const actionStats = await ActivityLog.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recent activity summary
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentActivityCount = await ActivityLog.countDocuments({
      userId: req.user.id,
      timestamp: { $gte: last7Days }
    });

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statistics: {
          actionStats: actionStats.map(stat => ({
            action: stat._id,
            count: stat.count
          })),
          recentActivityCount,
          totalActivities: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs
};
