import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  BarChart3,
  Clock,
  TrendingUp,
  Award,
  Play,
  Calendar,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Total Interviews',
      value: '12',
      icon: FileText,
      color: 'bg-blue-500',
      change: '+2 from last month',
    },
    {
      name: 'Average Score',
      value: '78%',
      icon: BarChart3,
      color: 'bg-green-500',
      change: '+5% improvement',
    },
    {
      name: 'Practice Hours',
      value: '24',
      icon: Clock,
      color: 'bg-purple-500',
      change: '+8 hours this month',
    },
    {
      name: 'Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: 'Personal best!',
    },
  ];

  const recentInterviews = [
    {
      id: 1,
      role: 'Frontend Developer',
      category: 'Technical',
      score: 85,
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      category: 'Mixed',
      score: 72,
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      role: 'Backend Developer',
      category: 'System Design',
      score: null,
      date: '2024-01-13',
      status: 'in-progress',
    },
  ];

  const quickActions = [
    {
      name: 'Start New Interview',
      description: 'Begin a new practice session',
      icon: Play,
      href: '/interviews/new',
      color: 'bg-primary-600',
    },
    {
      name: 'View Analytics',
      description: 'Track your progress and insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-green-600',
    },
    {
      name: 'Review History',
      description: 'See past interview sessions',
      icon: Clock,
      href: '/activity',
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's an overview of your interview practice progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                  <dd className="text-sm text-gray-600">{stat.change}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Interviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Interviews</h3>
          <Link
            to="/interviews"
            className="text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentInterviews.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first interview session.
              </p>
              <div className="mt-6">
                <Link
                  to="/interviews/new"
                  className="btn btn-primary"
                >
                  Start New Interview
                </Link>
              </div>
            </div>
          ) : (
            recentInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{interview.role}</p>
                    <p className="text-sm text-gray-500">{interview.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    {interview.score ? (
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">{interview.score}%</span>
                        <Award className="ml-2 h-5 w-5 text-yellow-500" />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">In Progress</span>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {interview.date}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      interview.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">AI Insights</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on your recent performance, you're excelling in technical questions. 
              Consider practicing more behavioral questions to improve your overall interview skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
