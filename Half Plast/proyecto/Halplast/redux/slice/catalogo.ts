import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Categoria } from '@/components/administrador/tablas/tiposFilas/catalogo';
import { getCatalogo } from "@/service/api/catalogo/catalogo/TodoCatalogo";

export const fetchCatalogo = createAsyncThunk('catalogo/fetchCatalogo', async () => {
  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem('catalogo');
    
    if (localData) {
      return JSON.parse(localData) as Categoria[];
    } else {
      const catalogo = await getCatalogo();
      localStorage.setItem('catalogo', JSON.stringify(catalogo));
      return catalogo;
    }
  } else {
    return await getCatalogo();
  }
});

export interface CatalogoState {
  catalogo: Categoria[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CatalogoState = {
  catalogo: [],
  status: 'idle',
  error: null
};

const catalogoSlice = createSlice({
  name: 'catalogo',
  initialState,
  reducers: {
    clearCatalogo: (state) => {
      state.catalogo = [];
      localStorage.removeItem('catalogo');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalogo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.catalogo = action.payload;
      })
      .addCase(fetchCatalogo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error desconocido';
      });
  }
});

export const { clearCatalogo } = catalogoSlice.actions;
export default catalogoSlice.reducer;
