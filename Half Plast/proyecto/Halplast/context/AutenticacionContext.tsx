import React, { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/redux/slice/userSlice';
import { RootState } from '@/redux/store';

interface DecodedToken {
  name: string;
  rol: {
    nombreRol: string;
    permisos: { nombrePermiso: string }[];
    extraPorcentaje: number;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  rol: {
    nombreRol: string;
    permisos: { nombrePermiso: string }[];
    extraPorcentaje: number;
  } | null;
  loginUser: (token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn: reduxIsLoggedIn, rol: reduxRol } = useSelector((state: RootState) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(reduxIsLoggedIn);
  const [rol, setRol] = useState<AuthContextType['rol']>(reduxRol || null);

  const loginUser = (token: string) => {
    const decoded = jwt.decode(token) as DecodedToken | null;
    if (decoded) {
      dispatch(login({ name: decoded.name, rol: decoded.rol, token }));
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setRol(decoded.rol);
    } else {
      console.error("Decoding failed: Invalid token structure");
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRol(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken | null;
      if (decoded) {
        dispatch(login({ name: decoded.name, rol: decoded.rol, token }));
        setIsLoggedIn(true);
        setRol(decoded.rol);
      } else {
        console.error('Token could not be decoded');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    setIsLoggedIn(reduxIsLoggedIn);
    setRol(reduxRol || null);
  }, [reduxIsLoggedIn, reduxRol]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, rol, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
