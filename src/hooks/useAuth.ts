import { useState, useCallback } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { loginUser, registerUser, verifyEmail } from '../services/auth';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await loginUser(credentials);
      setState(prev => ({ ...prev, user, isLoading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await registerUser(credentials);
      setState(prev => ({ ...prev, user, isLoading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      }));
      return false;
    }
  }, []);

  const verify = useCallback(async (token: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const verified = await verifyEmail(token);
      if (verified && state.user) {
        setState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, verified: true } : null,
          isLoading: false,
        }));
      }
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      }));
      return false;
    }
  }, [state.user]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, user: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    verify,
    logout,
  };
};