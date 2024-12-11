// authcontext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const saveToken = async (newToken) => {
        await AsyncStorage.setItem('jwt_ag', newToken);
        setToken(newToken);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('jwt_ag');
        setToken(null);  // Actualizamos el estado del token a null
    };

    return (
        <AuthContext.Provider value={{ token, saveToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
