import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Divider,
} from '@mui/material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              МОТО РЫМЫД
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Каталог моторов и двигателей для ваших проектов
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Разделы
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ display: 'block', mb: 1 }}
            >
              Главная
            </Link>
            <Link
              component={RouterLink}
              to="/motors"
              color="inherit"
              sx={{ display: 'block', mb: 1 }}
            >
              Моторы
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Контакты
            </Typography>
            <Typography variant="body2" paragraph>
              Адрес: ул. Примерная, 123, г. Москва
            </Typography>
            <Typography variant="body2" paragraph>
              Email: info@motorymyd.ru
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Typography variant="body2" align="center">
          © {currentYear} МОТО РЫМЫД. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 