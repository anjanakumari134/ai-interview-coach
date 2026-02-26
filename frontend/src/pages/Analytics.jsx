import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Activity,
  Brain,
} from 'lucide-react';

const Analytics = () => {
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsAPI.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading analytics: {error.message}</p>
      </div>
    );
  }

  const data = analyticsData?.data || {};
  const { overview, categoryPerformance, rolePerformance, progressOverTime, insights } = data;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-md ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  change.includes('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change.includes('+') ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                  )}
                  <span className="ml-1">{change}</span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your interview performance and progress over time
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Interviews"
          value={overview?.totalInterviews || 0}
          change={overview?.completionRate ? `${overview.completionRate}% completion` : null}
          icon={Activity}
          color="bg-blue-500"
        />
        <StatCard
          title="Average Score"
          value={`${overview?.avgScore || 0}%`}
          change={overview?.avgScore >= 70 ? '+5% improvement' : null}
          icon={Target}
          color="bg-green-500"
        />
        <StatCard
          title="Highest Score"
          value={`${overview?.highestScore || 0}%`}
          icon={Award}
          color="bg-yellow-500"
        />
        <StatCard
          title="Practice Streak"
          value="7 days"
          change="+2 days"
          icon={Brain}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Interviews by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rolePerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ role, interviewsCount }) => `${role}: ${interviewsCount}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="interviewsCount"
              >
                {rolePerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Over Time */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div className="card bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
        <div className="flex items-center mb-4">
          <Brain className="h-8 w-8 text-primary-600 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {insights?.map((insight, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-primary-600 rounded-full mt-2"></div>
              </div>
              <p className="ml-3 text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Categories */}
      {data.weakCategories && data.weakCategories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h3>
          <div className="space-y-3">
            {data.weakCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-600">{category.improvement}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-red-600">{category.avgScore}%</span>
                  <p className="text-xs text-gray-500">Average Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
