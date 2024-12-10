import { UserState } from '../redux/slice/userSlice';

const LOCAL_STORAGE_KEY = 'userState';

export const saveState = (state: UserState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (e) {
    console.error('No se pudo guardar el estado en localStorage', e);
  }
};

export const loadState = (): UserState | undefined => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('No se pudo cargar el estado desde localStorage', e);
    return undefined;
  }
};
