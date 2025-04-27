import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { fetchMotors, deleteMotor } from '../store/slices/motorSlice';
import { RootState, AppDispatch } from '../store/store';
import { openConfirmDialog } from '../store/slices/uiSlice';

// Компонент админ-панели
const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { motors, loading, error } = useSelector((state: RootState) => state.motors);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Проверяем права доступа при загрузке
  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Загружаем моторы при монтировании
  useEffect(() => {
    dispatch(fetchMotors());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddMotor = () => {
    navigate('/admin/motors/add');
  };

  const handleEditMotor = (id: string) => {
    navigate(`/admin/motors/edit/${id}`);
  };

  const handleViewMotor = (id: string) => {
    navigate(`/motors/${id}`);
  };

  const handleDeleteMotor = (id: string, name: string) => {
    dispatch(
      openConfirmDialog({
        title: 'Удаление мотора',
        message: `Вы уверены, что хотите удалить мотор "${name}"?`,
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        onConfirm: async () => {
          await dispatch(deleteMotor(id));
          // После удаления обновляем список
          dispatch(fetchMotors());
        },
      })
    );
  };

  // Рендер таблицы моторов
  const renderMotorsTable = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }

    if (motors.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          В каталоге нет моторов. Добавьте первый мотор.
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Мощность</TableCell>
              <TableCell>Цена (₽)</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {motors.map((motor) => (
              <TableRow key={motor._id}>
                <TableCell component="th" scope="row">
                  {motor.name}
                </TableCell>
                <TableCell>{motor.category}</TableCell>
                <TableCell>{motor.power} л.с.</TableCell>
                <TableCell>{motor.price.toLocaleString()}</TableCell>
                <TableCell>
                  {motor.available ? (
                    <Chip label="В наличии" color="success" size="small" />
                  ) : (
                    <Chip label="Под заказ" color="warning" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Просмотр">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleViewMotor(motor._id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редактировать">
                    <IconButton
                      color="info"
                      size="small"
                      onClick={() => handleEditMotor(motor._id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteMotor(motor._id, motor.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Рендер управления пользователями (заглушка)
  const renderUsersManagement = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          Управление пользователями будет доступно в следующей версии.
        </Alert>
      </Box>
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель администратора
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Каталог моторов" />
          <Tab label="Пользователи" />
        </Tabs>

        {tabValue === 0 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddMotor}
          >
            Добавить мотор
          </Button>
        )}
      </Box>

      {/* Содержимое вкладок */}
      <Box sx={{ mt: 2 }}>
        {tabValue === 0 ? renderMotorsTable() : renderUsersManagement()}
      </Box>
    </Container>
  );
};

export default AdminPage; 