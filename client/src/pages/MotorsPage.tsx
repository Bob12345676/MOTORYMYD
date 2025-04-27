import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Pagination,
  Divider,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { RootState, AppDispatch } from '../store/store';
import { fetchMotors, setPage, setSearch, setMinPower, setMaxPower, setAvailable, resetFilters } from '../store/slices/motorSlice';
import MotorCard from '../components/motors/MotorCard';

const MotorsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    motors, 
    loading, 
    error, 
    total, 
    pagination, 
    filters 
  } = useSelector((state: RootState) => state.motors);
  
  const [powerRange, setPowerRange] = useState<number[]>([0, 1000]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Загрузка моторов при монтировании компонента и изменении параметров
  useEffect(() => {
    dispatch(fetchMotors());
  }, [dispatch, pagination.page, filters]);

  // Обработчики фильтров
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    
    // Отменяем предыдущий таймаут, если он существует
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Устанавливаем новый таймаут
    const timeout = setTimeout(() => {
      dispatch(setSearch(searchValue));
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handlePowerRangeChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPowerRange(newValue);
    }
  };
  
  const handlePowerRangeChangeCommitted = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      dispatch(setMinPower(newValue[0] === 0 ? null : newValue[0]));
      dispatch(setMaxPower(newValue[1] === 1000 ? null : newValue[1]));
    }
  };

  const handleAvailableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAvailable(event.target.checked ? true : null));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPowerRange([0, 1000]);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Каталог моторов
        </Typography>

        {/* Фильтры */}
        <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Фильтры
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Поиск по названию"
                  variant="outlined"
                  defaultValue={filters.search}
                  onChange={handleSearchChange}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>
                  Мощность (л.с.)
                </Typography>
                <Slider
                  value={powerRange}
                  onChange={handlePowerRangeChange}
                  onChangeCommitted={handlePowerRangeChangeCommitted}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    От: {powerRange[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    До: {powerRange[1]}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={filters.available === true}
                      onChange={handleAvailableChange}
                    />
                  }
                  label="Только в наличии"
                />
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleResetFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Результаты поиска */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : motors.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            Моторы не найдены. Попробуйте изменить параметры поиска.
          </Typography>
        ) : (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>
                Найдено: {total} моторов
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {motors.map((motor) => (
                <Grid item key={motor._id} xs={12} sm={6} md={4}>
                  <MotorCard motor={motor} />
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default MotorsPage; 