import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { fetchMotorById, clearMotorDetails } from '../store/slices/motorSlice';
import { RootState, AppDispatch } from '../store/store';
import { openConfirmDialog } from '../store/slices/uiSlice';

const MotorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { motorDetails, loading, error } = useSelector((state: RootState) => state.motors);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchMotorById(id));
    }
    
    return () => {
      dispatch(clearMotorDetails());
    };
  }, [dispatch, id]);

  const handleDeleteClick = () => {
    if (!motorDetails) return;
    
    dispatch(
      openConfirmDialog({
        title: 'Удаление мотора',
        message: `Вы уверены, что хотите удалить мотор "${motorDetails.name}"?`,
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        onConfirm: () => {
          // Здесь будет логика удаления
          navigate('/motors');
        },
      })
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/motors')}
        >
          Вернуться к каталогу
        </Button>
      </Container>
    );
  }

  if (!motorDetails) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          Мотор не найден
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/motors')}
          sx={{ mt: 2 }}
        >
          Вернуться к каталогу
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        {/* Хлебные крошки */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer' }}
          >
            Главная
          </Link>
          <Link 
            underline="hover" 
            color="inherit"
            onClick={() => navigate('/motors')}
            sx={{ cursor: 'pointer' }}
          >
            Моторы
          </Link>
          <Typography color="text.primary">{motorDetails.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Изображение */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Box
                component="img"
                src={motorDetails.images && motorDetails.images.length > 0 
                  ? motorDetails.images[0] 
                  : 'https://via.placeholder.com/500x400?text=Нет+изображения'}
                alt={motorDetails.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Paper>
          </Grid>

          {/* Информация о моторе */}
          <Grid item xs={12} md={7}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {motorDetails.name}
              </Typography>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Модель: {motorDetails.model}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={`${motorDetails.power} л.с.`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`${motorDetails.weight} кг`}
                  color="secondary"
                  size="small"
                />
                {motorDetails.available ? (
                  <Chip
                    icon={<CheckIcon />}
                    label="В наличии"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<CloseIcon />}
                    label="Под заказ"
                    color="warning"
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="h5" color="primary.main" gutterBottom>
                {motorDetails.price.toLocaleString()} ₽
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Описание
              </Typography>
              <Typography variant="body1" paragraph>
                {motorDetails.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Технические характеристики
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Мощность" 
                    secondary={`${motorDetails.power} л.с.`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Напряжение" 
                    secondary={`${motorDetails.voltage} В`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Ток" 
                    secondary={`${motorDetails.current} А`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Скорость вращения" 
                    secondary={`${motorDetails.speed} об/мин`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Вес" 
                    secondary={`${motorDetails.weight} кг`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Габариты" 
                    secondary={`${motorDetails.dimensions?.length} × ${motorDetails.dimensions?.width} × ${motorDetails.dimensions?.height} мм`} 
                  />
                </ListItem>
              </List>

              {motorDetails.features && motorDetails.features.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Особенности
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {motorDetails.features.map((feature, index) => (
                      <Chip key={index} label={feature} size="small" />
                    ))}
                  </Box>
                </>
              )}

              {motorDetails.applications && motorDetails.applications.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Применение
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {motorDetails.applications.map((application, index) => (
                      <Chip key={index} label={application} size="small" />
                    ))}
                  </Box>
                </>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  size="large"
                >
                  Добавить в корзину
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/motors')}
                >
                  К каталогу
                </Button>
              </Box>

              {/* Кнопки администратора */}
              {isAuthenticated && user && user.role === 'admin' && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => navigate(`/admin/motors/edit/${motorDetails._id}`)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteClick}
                  >
                    Удалить
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MotorDetailPage; 