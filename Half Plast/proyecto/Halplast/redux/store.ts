import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer, { UserState } from './slice/userSlice';
import catalogoReducer, { CatalogoState } from './slice/catalogo';
import carritoReducer, { CarritoState } from './slice/carritoCompra';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createLogger } from 'redux-logger';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'catalogo', 'carrito'],
};

interface PersistedState {
  _persist: {
    version: number;
    rehydrated: boolean;
  };
}

const rootReducer = combineReducers({
  user: userReducer,
  catalogo: catalogoReducer,
  carrito: carritoReducer,
});

export type RootState = ReturnType<typeof rootReducer> & PersistedState;

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const logger = createLogger({
//   collapsed: true,
// });

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewareArray = getDefaultMiddleware({
      serializableCheck: false,
    });

    // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    //   middlewareArray.push(logger);
    // }

    return middlewareArray;
  },
});

export const persistor = persistStore(store);
