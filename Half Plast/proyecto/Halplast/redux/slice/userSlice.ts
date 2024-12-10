import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist/es/constants';
import { AnyAction } from 'redux';

export interface UserState {
  isLoggedIn: boolean;
  name: string;
  rol?: {
    nombreRol: string;
    permisos: { nombrePermiso: string }[];
    extraPorcentaje: number;
  };
  token?: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  name: '',
  rol: {
    nombreRol: '',
    permisos: [],
    extraPorcentaje: 0,
  },
  token: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; rol?: UserState['rol']; token: string }>) => {
      const { name, rol, token } = action.payload;
      state.isLoggedIn = true;
      state.name = name;
      state.rol = rol;
      state.token = token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.name = '';
      state.rol = initialState.rol;
      state.token = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: AnyAction) => {
      const rehydratedUser = action.payload?.user;
      if (rehydratedUser) {
        state.isLoggedIn = rehydratedUser.isLoggedIn || false;
        state.name = rehydratedUser.name || '';
        state.rol = rehydratedUser.rol || initialState.rol;
        state.token = rehydratedUser.token || undefined;
      }
    });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
