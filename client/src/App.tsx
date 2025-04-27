import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { checkAuth } from './store/slices/authSlice';
import { RootState, AppDispatch } from './store/store';

// Компоненты для лэйаута
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Страницы
import HomePage from './pages/HomePage';
import MotorsPage from './pages/MotorsPage';
import MotorDetailPage from './pages/MotorDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);

  // Проверяем статус аутентификации при загрузке
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: (theme) =>
          darkMode ? theme.palette.grey[900] : theme.palette.background.default,
        color: (theme) =>
          darkMode ? theme.palette.common.white : theme.palette.text.primary,
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/motors" element={<MotorsPage />} />
          <Route path="/motors/:id" element={<MotorDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Защищенные маршруты */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/motors/add"
            element={
              <ProtectedRoute roles={['admin']}>
                <div>Страница добавления мотора (в разработке)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/motors/edit/:id"
            element={
              <ProtectedRoute roles={['admin']}>
                <div>Страница редактирования мотора (в разработке)</div>
              </ProtectedRoute>
            }
          />
          
          {/* Редирект для неизвестных маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
