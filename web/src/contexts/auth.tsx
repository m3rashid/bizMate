import { createContext, useContext } from 'react';
import { User } from '../types';

export type AuthContext = {
  isAuthenticated: boolean;
  user: User | null;
};

export const defaultAuthContext: AuthContext = {
  isAuthenticated: false,
  user: null,
};

const authContext = createContext<AuthContext>(defaultAuthContext);

export const AuthProvider = authContext.Provider;

export function useAuth() {
  return useContext(authContext);
}
