import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductoCarrito {
  idProducto: string;
  idColor: string;
  idPeso: string;
  longitudProducto: number;
  longitudProductoSimbolo: string;
  productoNombre: string;
  longitud: number | { parte1: number; parte2: number };
  simboloLongitud: string;
  peso: number;
  simboloPeso: string;
  colorNombre: string;
  cantidad: number;
  precioUnitario: number;
  simboloprecioUnitario: string;
  identificadorPrecio: string;
  tipoProducto: number;
}

export  interface CarritoState {
  carrito: ProductoCarrito[];
}

const initialState: CarritoState = {
  carrito: [],
};

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarProducto: (state, action: PayloadAction<ProductoCarrito>) => {
      const producto = action.payload;
      const existeProducto = state.carrito.find(
        (item) =>
          item.idProducto === producto.idProducto
          &&
          typeof item.longitud === 'object' && typeof producto.longitud === 'object' ? 
            item.longitud.parte1 === producto.longitud.parte1 && item.longitud.parte2 === producto.longitud.parte2 
            : 
            item.longitud === producto.longitud
          &&  
          item.idColor === producto.idColor &&
          (item.longitudProductoSimbolo === 'mt' || item.peso === producto.peso)
      );
      
      if (existeProducto && existeProducto.simboloprecioUnitario === 'Kg') {
        existeProducto.peso += producto.peso;
      }
      else if (existeProducto) {
        existeProducto.cantidad += producto.cantidad;
      } else {
        state.carrito.push(producto);
      }
    },
    modificarCantidad: (
      state,
      action: PayloadAction<{
        idProducto: string;
        idColor: string;
        Peso: number;
        cantidad: number;
        longitud: number | { parte1: number; parte2: number };
      }>
    ) => {
      
      const { idProducto, idColor, Peso, cantidad, longitud } = action.payload;
      const producto = state.carrito.find(
        (item) =>
          item.idProducto === idProducto 
          &&
          typeof item.longitud === 'object' && typeof longitud === 'object' ? 
            item.longitud.parte1 === longitud.parte1 && item.longitud.parte2 === longitud.parte2 
            : 
            item.longitud === longitud
          &&
          item.idColor === idColor &&
          item.peso === Peso
      );
      if (producto) {
        if (cantidad > 0) {
          producto.cantidad = cantidad;
        } else {
          state.carrito = state.carrito.filter(
            (item) =>
              !(item.idProducto === idProducto &&
                item.idColor === idColor &&
                item.peso === Peso)
          );
        }
      }
    },
    modificarPeso: (
      state,
      action: PayloadAction<{
        idProducto: string;
        idColor: string;
        Peso: number;
        longitud: number | { parte1: number; parte2: number };
      }>
    ) => {
      const { idProducto, idColor, Peso, longitud } = action.payload;
      
      const producto = state.carrito.find((item) => {
        const isLongitudMatch =
          typeof longitud === 'number' && typeof item.longitud === 'number'
            ? item.longitud === longitud
            : typeof longitud === 'object' && typeof item.longitud === 'object' &&
              item.longitud.parte1 === longitud.parte1 &&
              item.longitud.parte2 === longitud.parte2;
        
        const isMatch =
          item.idProducto === idProducto &&
          isLongitudMatch &&
          item.idColor === idColor
          item.peso === Peso;


        return isMatch;
      });
    
      if (producto) {
        if (Peso > 0) {
          producto.peso = Peso;
        } else {
          state.carrito = state.carrito.filter(
            (item) =>
              !(item.idProducto === idProducto &&
                item.idColor === idColor &&
                item.peso === Peso)
          );
        }
      }
    },
    eliminarProducto: (
      state,
      action: PayloadAction<{
        idProducto: string;
        idColor: string;
        Peso: number;
        longitud: number | { parte1: number; parte2: number };
      }>
    ) => {
      state.carrito = state.carrito.filter(
        (item) =>
          !(
            item.idProducto === action.payload.idProducto &&
            item.idColor === action.payload.idColor
            &&
            typeof item.longitud === 'object' && typeof action.payload.longitud === 'object' ? 
              item.longitud.parte1 === action.payload.longitud.parte1 && item.longitud.parte2 === action.payload.longitud.parte2 
              : 
              item.longitud === action.payload.longitud
            &&
            item.peso === action.payload.Peso
          )
      );
    },
    vaciarCarrito: (state) => {
      state.carrito = [];
    },
  },
});

export const { agregarProducto, modificarCantidad, eliminarProducto, vaciarCarrito, modificarPeso } = carritoSlice.actions;

export default carritoSlice.reducer;
