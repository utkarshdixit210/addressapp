import { LoginCredentials, RegisterCredentials, User } from '../types/auth';

// Simulated API calls - replace with actual API endpoints
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({
          id: '1',
          email: credentials.email,
          name: 'John Doe',
          verified: true,
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const registerUser = async (credentials: RegisterCredentials): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password && credentials.name) {
        resolve({
          id: '1',
          email: credentials.email,
          name: credentials.name,
          verified: false,
        });
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 1000);
  });
};

export const verifyEmail = async (token: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};