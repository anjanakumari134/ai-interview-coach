import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
const AuthContext = createContext();
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: false,
};
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
};
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
      };
    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
          payload: response.user,
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE });
      }
    } else {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE });
    }
  };
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const response = await authAPI.login(credentials);
      const { token, user } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, user },
      });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };
  const register = async (userData) => {
    try {
      console.log('Register function called with:', userData);
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      const response = await authAPI.register(userData);
      const { token, user } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, user },
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
