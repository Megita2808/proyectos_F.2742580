// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Aquí podrías verificar si el usuario está autenticado, por ejemplo, mirando el localStorage o haciendo una llamada a una API
    const user = localStorage.getItem('user'); // Si tienes algo guardado en el localStorage
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('user', 'true'); // Guarda algo que indique que el usuario está autenticado
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user'); // Elimina la información de autenticación
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
