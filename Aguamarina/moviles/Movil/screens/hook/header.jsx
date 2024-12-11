import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
                <Text style={styles.buttonTextHeader2}>Volver</Text>
            </TouchableOpacity>
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
        justifyContent: 'flex-end', 
        paddingHorizontal: 5,
        paddingVertical: 15, 
        marginBottom: 0, 
        marginLeft: 0, 
    },
    logoutButtonHeader: {
        padding: 10,
        marginLeft: 'auto',
        marginRight: 5, 
        maxWidth: 150,
    },
    backButtonHeader: {
        padding: 10,
        marginRight: 15,
        maxWidth: 150,
    },
    buttonTextHeader: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        flexShrink: 1,
        overflow: 'hidden',
        marginRight: 0
    },
    buttonTextHeader2: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        flexShrink: 1,
        overflow: 'hidden',
        marginRight: -10
    },
});

export default Header;
