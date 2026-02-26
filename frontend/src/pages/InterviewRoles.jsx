import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/aiService';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Code,
  Users,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewRoles = () => {
  const [expandedRoles, setExpandedRoles] = useState(new Set());
  const [editingRole, setEditingRole] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    categories: [
      {
        name: 'Technical',
        description: 'Technical and coding questions',
        aiPrompt: 'Generate technical interview questions that assess coding skills and technical knowledge'
      },
      {
        name: 'Behavioral',
        description: 'Behavioral and soft skills questions',
        aiPrompt: 'Generate behavioral interview questions that assess teamwork, communication, and problem-solving skills'
      }
    ]
  });

  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['interview-roles'],
    queryFn: aiService.getInterviewRoles,
  });

  const createRoleMutation = useMutation({
    mutationFn: aiService.createInterviewRole,
    onSuccess: () => {
      toast.success('Interview role created successfully!');
      setShowCreateForm(false);
      setNewRole({
        name: '',
        description: '',
        categories: [
          {
            name: 'Technical',
            description: 'Technical and coding questions',
            aiPrompt: 'Generate technical interview questions that assess coding skills and technical knowledge'
          },
          {
            name: 'Behavioral',
            description: 'Behavioral and soft skills questions',
            aiPrompt: 'Generate behavioral interview questions that assess teamwork, communication, and problem-solving skills'
          }
        ]
      });
      queryClient.invalidateQueries(['interview-roles']);
    },
    onError: (error) => {
      toast.error('Failed to create interview role');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, roleData }) => aiService.updateInterviewRole(id, roleData),
    onSuccess: () => {
      toast.success('Interview role updated successfully!');
      setEditingRole(null);
      queryClient.invalidateQueries(['interview-roles']);
    },
    onError: (error) => {
      toast.error('Failed to update interview role');
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: aiService.deleteInterviewRole,
    onSuccess: () => {
      toast.success('Interview role deleted successfully!');
      queryClient.invalidateQueries(['interview-roles']);
    },
    onError: (error) => {
      toast.error('Failed to delete interview role');
    },
  });

  const toggleRoleExpansion = (roleId) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const handleCreateRole = () => {
    createRoleMutation.mutate(newRole);
  };

  const handleUpdateRole = (id, roleData) => {
    updateRoleMutation.mutate({ id, roleData });
  };

  const handleDeleteRole = (id) => {
    if (window.confirm('Are you sure you want to delete this interview role?')) {
      deleteRoleMutation.mutate(id);
    }
  };

  const addCategory = (roleData, setRoleData) => {
    setRoleData({
      ...roleData,
      categories: [
        ...roleData.categories,
        {
          name: '',
          description: '',
          aiPrompt: ''
        }
      ]
    });
  };

  const removeCategory = (roleData, setRoleData, index) => {
    setRoleData({
      ...roleData,
      categories: roleData.categories.filter((_, i) => i !== index)
    });
  };

  const updateCategory = (roleData, setRoleData, index, field, value) => {
    setRoleData({
      ...roleData,
      categories: roleData.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      )
    });
  };

  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'technical':
        return <Code className="h-4 w-4" />;
      case 'behavioral':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Interview Roles</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage interview roles and categories for AI-powered question generation
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </button>
      </div>

      {/* Create Role Form */}
      {showCreateForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Create New Interview Role</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Frontend Developer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Describe this interview role..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Categories</label>
                <button
                  onClick={() => addCategory(newRole, setNewRole)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add Category
                </button>
              </div>
              
              {newRole.categories.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(category.name)}
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(newRole, setNewRole, index, 'name', e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Category name"
                      />
                    </div>
                    {newRole.categories.length > 1 && (
                      <button
                        onClick={() => removeCategory(newRole, setNewRole, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={category.description}
                    onChange={(e) => updateCategory(newRole, setNewRole, index, 'description', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent mb-2"
                    placeholder="Category description"
                  />
                  
                  <textarea
                    value={category.aiPrompt}
                    onChange={(e) => updateCategory(newRole, setNewRole, index, 'aiPrompt', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                    placeholder="AI prompt for generating questions in this category..."
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={createRoleMutation.isLoading}
                className="btn btn-primary"
              >
                {createRoleMutation.isLoading ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roles List */}
      <div className="space-y-4">
        {roles?.data?.map((role) => (
          <div key={role._id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRoleExpansion(role._id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedRoles.has(role._id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setEditingRole(role)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteRole(role._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expandedRoles.has(role._id) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {role.categories.map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCategoryIcon(category.name)}
                        <h5 className="font-medium text-gray-900">{category.name}</h5>
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Edit Interview Role</h2>
              <button
                onClick={() => setEditingRole(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <RoleEditForm
              role={editingRole}
              onSave={(roleData) => handleUpdateRole(editingRole._id, roleData)}
              onCancel={() => setEditingRole(null)}
              isLoading={updateRoleMutation.isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const RoleEditForm = ({ role, onSave, onCancel, isLoading }) => {
  const [roleData, setRoleData] = useState(role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(roleData);
  };

  const addCategory = () => {
    setRoleData({
      ...roleData,
      categories: [
        ...roleData.categories,
        {
          name: '',
          description: '',
          aiPrompt: ''
        }
      ]
    });
  };

  const removeCategory = (index) => {
    setRoleData({
      ...roleData,
      categories: roleData.categories.filter((_, i) => i !== index)
    });
  };

  const updateCategory = (index, field, value) => {
    setRoleData({
      ...roleData,
      categories: roleData.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      )
    });
  };

  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'technical':
        return <Code className="h-4 w-4" />;
      case 'behavioral':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
        <input
          type="text"
          value={roleData.name}
          onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={roleData.description}
          onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={3}
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <button
            type="button"
            onClick={addCategory}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Add Category
          </button>
        </div>

        {roleData.categories.map((category, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(category.name)}
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateCategory(index, 'name', e.target.value)}
                  className="flex-1 p-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Category name"
                  required
                />
              </div>
              {roleData.categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <input
              type="text"
              value={category.description}
              onChange={(e) => updateCategory(index, 'description', e.target.value)}
              className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent mb-2"
              placeholder="Category description"
              required
            />

            <textarea
              value={category.aiPrompt}
              onChange={(e) => updateCategory(index, 'aiPrompt', e.target.value)}
              className="w-full p-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="AI prompt for generating questions in this category..."
              required
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default InterviewRoles;
