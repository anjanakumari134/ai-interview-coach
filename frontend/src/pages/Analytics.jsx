import React, { useState } from 'react';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Brain,
  BarChart3,
  Users,
  FileText,
  Calendar,
  Clock,
  Star,
} from 'lucide-react';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('performance');
  
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

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'performance', name: 'Performance', icon: BarChart3 },
            { id: 'roles', name: 'Interview Roles', icon: Users },
            { id: 'progress', name: 'Progress Report', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Interviews"
              value={overview?.totalInterviews || 0}
              change={overview?.completionRate ? `${overview.completionRate}% completion` : null}
              icon={FileText}
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

          {/* Performance Charts */}
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

            {/* Skills Radar */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Assessment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={categoryPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="avgScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Over Time */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Score Progress Over Time</h3>
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
        </div>
      )}

      {/* Interview Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Role Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* Role Performance Comparison */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Role Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rolePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Role Analysis */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Role Analysis</h3>
            <div className="space-y-4">
              {rolePerformance?.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div>
                      <p className="font-medium text-gray-900">{role.role}</p>
                      <p className="text-sm text-gray-500">{role.interviewsCount} interviews completed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{role.avgScore}%</p>
                      <p className="text-sm text-gray-500">Average Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{role.highestScore || 0}%</p>
                      <p className="text-sm text-gray-500">Highest Score</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor((role.avgScore || 0) / 20)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress Report Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">This Month</p>
                  <p className="text-2xl font-bold text-blue-900">8 Interviews</p>
                  <p className="text-sm text-blue-700">+3 from last month</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Total Practice Time</p>
                  <p className="text-2xl font-bold text-green-900">24.5 Hours</p>
                  <p className="text-sm text-green-700">+5.2 hours this month</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Achievement Rate</p>
                  <p className="text-2xl font-bold text-purple-900">85%</p>
                  <p className="text-sm text-purple-700">Above target!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Progress Timeline */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Timeline</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2} name="Average Score" />
                <Line type="monotone" dataKey="highestScore" stroke="#10b981" strokeWidth={2} name="Highest Score" />
                <Line type="monotone" dataKey="interviewsCount" stroke="#f59e0b" strokeWidth={2} name="Interview Count" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Achievements */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Scored 90%+ in Frontend Interview</p>
                  <p className="text-sm text-gray-600">Achieved on January 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">7-Day Practice Streak</p>
                  <p className="text-sm text-gray-600">Current streak - keep it up!</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Completed 10 Technical Interviews</p>
                  <p className="text-sm text-gray-600">Milestone reached on January 10, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights - Show on all tabs */}
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

      {/* Weak Categories - Show on performance tab */}
      {activeTab === 'performance' && data.weakCategories && data.weakCategories.length > 0 && (
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
