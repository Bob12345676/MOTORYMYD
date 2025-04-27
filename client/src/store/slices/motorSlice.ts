import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Motor } from '../../types/Motor';
import { RootState, MotorsState } from '../types';
import api from '../../utils/api';

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface MotorsResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    pages: number;
    page: number;
    limit: number;
  };
  data: Motor[];
}

export interface MotorResponse {
  success: boolean;
  data: Motor;
}

const initialState: MotorsState = {
  motors: [],
  motorDetails: null,
  loading: false,
  error: null,
  total: 0,
  pagination: {
    pages: 1,
    page: 1,
    limit: 10,
  },
  filters: {
    search: '',
    minPower: null,
    maxPower: null,
    available: null,
  },
};

// Получение списка моторов с учетом фильтров и пагинации
export const fetchMotors = createAsyncThunk(
  'motors/fetchMotors',
  async (_, { getState, rejectWithValue }) => {
    const { motors } = getState() as { motors: MotorsState };
    const { page, limit } = motors.pagination;
    const { search, minPower, maxPower, available } = motors.filters;

    let url = `/motors?page=${page}&limit=${limit}`;

    if (search) {
      url += `&search=${search}`;
    }

    if (minPower !== null) {
      url += `&minPower=${minPower}`;
    }

    if (maxPower !== null) {
      url += `&maxPower=${maxPower}`;
    }

    if (available !== null) {
      url += `&available=${available}`;
    }

    try {
      const response = await api.get<MotorsResponse>(url);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue('Произошла ошибка при загрузке данных');
      }
    }
  }
);

// Получение одного мотора по ID
export const fetchMotorById = createAsyncThunk(
  'motors/fetchMotorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<MotorResponse>(`/motors/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue('Произошла ошибка при загрузке данных');
      }
    }
  }
);

// Создание нового мотора
export const createMotor = createAsyncThunk(
  'motors/createMotor',
  async (motorData: Partial<Motor>, { rejectWithValue }) => {
    try {
      const response = await api.post<MotorResponse>('/motors', motorData);
      toast.success('Двигатель успешно создан');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        return rejectWithValue(error.response.data.error);
      } else {
        toast.error('Произошла ошибка при создании двигателя');
        return rejectWithValue('Произошла ошибка при создании двигателя');
      }
    }
  }
);

// Обновление мотора
export const updateMotor = createAsyncThunk(
  'motors/updateMotor',
  async ({ id, motorData }: { id: string; motorData: Partial<Motor> }, { rejectWithValue }) => {
    try {
      const response = await api.put<MotorResponse>(`/motors/${id}`, motorData);
      toast.success('Двигатель успешно обновлен');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        return rejectWithValue(error.response.data.error);
      } else {
        toast.error('Произошла ошибка при обновлении двигателя');
        return rejectWithValue('Произошла ошибка при обновлении двигателя');
      }
    }
  }
);

// Удаление мотора
export const deleteMotor = createAsyncThunk(
  'motors/deleteMotor',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/motors/${id}`);
      toast.success('Двигатель успешно удален');
      return id;
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        return rejectWithValue(error.response.data.error);
      } else {
        toast.error('Произошла ошибка при удалении двигателя');
        return rejectWithValue('Произошла ошибка при удалении двигателя');
      }
    }
  }
);

const motorSlice = createSlice({
  name: 'motors',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Сбрасываем страницу на первую при изменении лимита
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.page = 1; // Сбрасываем страницу на первую при изменении поиска
    },
    setMinPower: (state, action: PayloadAction<number | null>) => {
      state.filters.minPower = action.payload;
      state.pagination.page = 1;
    },
    setMaxPower: (state, action: PayloadAction<number | null>) => {
      state.filters.maxPower = action.payload;
      state.pagination.page = 1;
    },
    setAvailable: (state, action: PayloadAction<boolean | null>) => {
      state.filters.available = action.payload;
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        minPower: null,
        maxPower: null,
        available: null,
      };
      state.pagination.page = 1;
    },
    clearMotorDetails: (state) => {
      state.motorDetails = null;
    },
    clearMotorsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Получение списка моторов
    builder.addCase(fetchMotors.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMotors.fulfilled, (state, action) => {
      state.loading = false;
      state.motors = action.payload.data;
      state.total = action.payload.total;
      state.pagination.pages = action.payload.pagination.pages;
    });
    builder.addCase(fetchMotors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Получение одного мотора
    builder.addCase(fetchMotorById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMotorById.fulfilled, (state, action) => {
      state.loading = false;
      state.motorDetails = action.payload.data;
    });
    builder.addCase(fetchMotorById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Создание нового мотора
    builder.addCase(createMotor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createMotor.fulfilled, (state, action) => {
      state.loading = false;
      state.motors = [...state.motors, action.payload.data];
    });
    builder.addCase(createMotor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Обновление мотора
    builder.addCase(updateMotor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateMotor.fulfilled, (state, action) => {
      state.loading = false;
      state.motors = state.motors.map((motor) =>
        motor._id === action.payload.data._id ? action.payload.data : motor
      );
      state.motorDetails = action.payload.data;
    });
    builder.addCase(updateMotor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Удаление мотора
    builder.addCase(deleteMotor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteMotor.fulfilled, (state, action) => {
      state.loading = false;
      state.motors = state.motors.filter((motor) => motor._id !== action.payload);
    });
    builder.addCase(deleteMotor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setPage,
  setLimit,
  setSearch,
  setMinPower,
  setMaxPower,
  setAvailable,
  resetFilters,
  clearMotorDetails,
  clearMotorsError,
} = motorSlice.actions;

// Selectors
export const selectAllMotors = (state: RootState) => state.motors.motors;
export const selectMotorDetails = (state: RootState) => state.motors.motorDetails;
export const selectMotorsLoading = (state: RootState) => state.motors.loading;
export const selectMotorsError = (state: RootState) => state.motors.error;

export default motorSlice.reducer; 