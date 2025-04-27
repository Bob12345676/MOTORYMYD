import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, AuthState } from '../types';
import api from '../../utils/api';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: Boolean(localStorage.getItem('token')),
  loading: false,
  error: null,
};

// Проверка статуса аутентификации
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Токен не найден');
    }

    const response = await api.get('/auth/me');
    return { user: response.data.data, token };
  } catch (error: any) {
    localStorage.removeItem('token');
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    } else {
      return rejectWithValue('Ошибка проверки аутентификации');
    }
  }
});

// Регистрация пользователя
export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { token, data } = response.data;
      localStorage.setItem('token', token);
      
      toast.success('Регистрация успешна!');
      
      return { user: data, token };
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        return rejectWithValue(error.response.data.error);
      } else {
        toast.error('Ошибка регистрации');
        return rejectWithValue('Ошибка регистрации');
      }
    }
  }
);

// Авторизация пользователя
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      
      const { token, data } = response.data;
      localStorage.setItem('token', token);
      
      toast.success('Вход выполнен успешно!');
      
      return { user: data, token };
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        return rejectWithValue(error.response.data.error);
      } else {
        toast.error('Ошибка входа');
        return rejectWithValue('Ошибка входа');
      }
    }
  }
);

// Выход пользователя
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    
    localStorage.removeItem('token');
    toast.success('Выход выполнен');
    
    return null;
  } catch (error: any) {
    localStorage.removeItem('token');
    if (error.response && error.response.data.error) {
      return rejectWithValue(error.response.data.error);
    } else {
      return rejectWithValue('Ошибка выхода');
    }
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Проверка статуса аутентификации
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
    });

    // Регистрация
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Вход
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Выход
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = authSlice.actions;
export const authReducer = authSlice.reducer; 