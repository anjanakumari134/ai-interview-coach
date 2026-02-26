import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityAPI } from '../services/api';
import {
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Calendar,
  Filter,
  ChevronDown,
} from 'lucide-react';

const Activity = () => {
  const [filterAction, setFilterAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const {
    data: activityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activity', { filterAction, startDate, endDate }],
    queryFn: () => activityAPI.getActivity({
      action: filterAction,
      startDate,
      endDate,
    }),
  });

  const activities = activityData?.data?.activities || [];
  const statistics = activityData?.data?.statistics || {};

  const getActionIcon = (action) => {
    switch (action) {
      case 'created':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <p className="text-red-600">Error loading activity: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Activity History</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track all your interview-related activities and changes
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.totalActivities || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Last 7 Days</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.recentActivityCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-purple-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Most Active</p>
              <p className="text-lg font-semibold text-gray-900">
                {statistics.actionStats?.[0]?.action || 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              className="input pl-10 appearance-none"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
          </div>

          <div>
            <input
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="card">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activity found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your activity history will appear here once you start using the platform.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">
                      {activity.action === 'created' && 'Created new interview session'}
                      {activity.action === 'updated' && 'Updated interview session'}
                      {activity.action === 'deleted' && 'Deleted interview session'}
                      {activity.action === 'completed' && 'Completed interview session'}
                    </p>
                    
                    {activity.sessionId && (
                      <div className="mt-1 text-sm text-gray-600">
                        {activity.sessionId.role && `Role: ${activity.sessionId.role}`}
                        {activity.sessionId.category && ` • Category: ${activity.sessionId.category}`}
                        {activity.details?.score && ` • Score: ${activity.details.score}%`}
                      </div>
                    )}
                    
                    {activity.details && (
                      <div className="mt-1 text-xs text-gray-500">
                        {Object.entries(activity.details).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
