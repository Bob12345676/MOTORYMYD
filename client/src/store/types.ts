// Типы для Redux store
import { Motor } from '../types/Motor';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

// Типы для motor slice
export interface MotorsState {
  motors: Motor[];
  motorDetails: Motor | null;
  loading: boolean;
  error: string | null;
  total: number;
  pagination: {
    pages: number;
    page: number;
    limit: number;
  };
  filters: {
    search: string;
    minPower: number | null;
    maxPower: number | null;
    available: boolean | null;
  };
}

// Типы для auth slice
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Типы для UI slice
export interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  confirmDialog: {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: (() => void) | null;
  };
}

// Тип для корневого состояния
export interface RootState {
  motors: MotorsState;
  auth: AuthState;
  ui: UiState;
}

// Тип для Dispatch
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>; 