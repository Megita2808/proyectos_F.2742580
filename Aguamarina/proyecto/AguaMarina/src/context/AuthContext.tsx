import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkToken } from '@/api/validations/check_cookie';

// Define el tipo para el contexto
interface AuthContextType {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
  user: JwtPayload | null;
  dataUser: any;
  loadPermissions: boolean,
  setLoadPermissions : any
}

interface JwtPayload {
  id_user: number;
  id_rol: number;
}

// Define el valor inicial del contexto
const defaultAuthContext: AuthContextType = {
  permissions: [],
  setPermissions: () => {}, // Placeholder
  user: null,
  dataUser: null,
  loadPermissions: false,
  setLoadPermissions: () => {}
};

// Crea el contexto
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Crea el proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [dataUser, setDataUser] = useState<any>(null);
  const [loadPermissions, setLoadPermissions] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await checkToken(); // Verifica el token actual
        setDataUser(data);
  
        if (data) {
          // Obtén los permisos asociados al usuario
          const permissions = data.data.permissions.map((permission: any) => permission.name);
          setPermissions(permissions);
        } else {
          console.error("No se pudo obtener el usuario.");
          setPermissions([]); // Limpia permisos si no hay usuario
        }
      } catch (error) {
        console.error("Error al procesar el token o permisos:", error);
        setPermissions([]); // Limpia permisos en caso de error
      }
    };
  
    fetchPermissions();
  }, [loadPermissions]);

  return (
    <AuthContext.Provider value={{ permissions, setPermissions, user, dataUser, loadPermissions, setLoadPermissions }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);