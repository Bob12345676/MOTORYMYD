import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          position: 'relative',
          backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.8), rgba(25, 118, 210, 0.9)), url(https://source.unsplash.com/random/1600x900/?motor,engine)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            МОТО РЫМЫД
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            paragraph
            sx={{ mb: 4 }}
          >
            Каталог моторов и двигателей для ваших проектов
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/motors"
            sx={{ px: 4, py: 1.5 }}
          >
            Открыть каталог
          </Button>
        </Container>
      </Box>

      {/* Features section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Почему выбирают нас
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Высокое качество
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Мы предлагаем только проверенные моторы от надежных производителей,
                    которые прослужат вам долгие годы.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Широкий выбор
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    В нашем каталоге представлены моторы для самых разных задач: от бытовых
                    приборов до промышленного оборудования.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Техническая поддержка
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Наши специалисты всегда готовы помочь с выбором и ответить на любые
                    вопросы по эксплуатации.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA section */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Готовы сделать выбор?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Просмотрите наш каталог или свяжитесь с нами для консультации
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/motors"
            sx={{ px: 4 }}
          >
            Перейти в каталог
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 