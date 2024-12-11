// header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';

const Header = () => {
    const { logout } = useAuth();
    const navigation = useNavigation();  // Usamos el hook para obtener acceso a la navegación

    const handleLogout = async () => {
        console.log("Cerrando sesión...");
        await logout();  // Llamamos a la función logout
        navigation.navigate('Login');  // Redirigimos al usuario a la pantalla de login
    };

    return (
        <View style={styles.headerstyle}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonHeader}>
                <Text style={styles.buttonTextHeader}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerstyle: {
        backgroundColor: '#EFF4FF',
        color: "black",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Asegura que el botón esté alineado a la derecha
        paddingHorizontal: 5,
        paddingVertical: 15, // Da un buen espacio sin depender de una altura fija
        marginBottom: 0, // Elimina el margen extra
        marginLeft: 0, // Elimina el margen extra
    },
    logoutButtonHeader: {
        padding: 10,
        marginLeft: 'auto', // Empuja el botón hacia la derecha
        marginRight: 20, // Ajusta el margen derecho para dar espacio
        maxWidth: 150, // Limita el ancho máximo del botón para pantallas grandes
    },
    buttonTextHeader: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        flexShrink: 1, // Asegura que el texto no se corte
        overflow: 'hidden', // Evita que el texto se desborde del contenedor
    },
});

export default Header;
