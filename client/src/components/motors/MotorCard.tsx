import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { Motor } from '../../types/Motor';

interface MotorCardProps {
  motor: Motor;
}

const MotorCard: React.FC<MotorCardProps> = ({ motor }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={motor.imageUrl || 'https://via.placeholder.com/300x200?text=Нет+изображения'}
        alt={motor.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {motor.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {motor.description.length > 100
            ? `${motor.description.substring(0, 100)}...`
            : motor.description}
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Chip
            label={`${motor.power} л.с.`}
            color="primary"
            size="small"
            sx={{ mb: 1 }}
          />
          <Chip
            label={`${motor.weight} кг`}
            color="secondary"
            size="small"
            sx={{ mb: 1 }}
          />
          {motor.available ? (
            <Chip
              label="В наличии"
              color="success"
              size="small"
              sx={{ mb: 1 }}
            />
          ) : (
            <Chip
              label="Под заказ"
              color="warning"
              size="small"
              sx={{ mb: 1 }}
            />
          )}
        </Stack>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary.main">
            {motor.price.toLocaleString()} ₽
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={RouterLink}
          to={`/motors/${motor._id}`}
          sx={{ ml: 'auto' }}
        >
          Подробнее
        </Button>
      </CardActions>
    </Card>
  );
};

export default MotorCard; 