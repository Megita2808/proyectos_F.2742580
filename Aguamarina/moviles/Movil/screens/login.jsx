import React, { useState } from 'react';
import { Text, Image, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from './hook/AuthContext';
import styles from "./Styles/Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

export default function LoginScreen({ navigation }) {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { saveToken } = useAuth();

    const handleLogin = async () => {
        const trimmedMail = mail.trim();
        const trimmedPassword = password.trim();
        if (!trimmedMail || !trimmedPassword) {
            Alert.alert('Error', 'Por favor, completa ambos campos.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/validate_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: trimmedMail, password: trimmedPassword })
            });
            const responseJson = await response.json();
            if (!response.ok) {
                throw new Error('Usuario o contraseña incorrectos');
            }
            if (responseJson.logged) {
                const token = responseJson.token;
                if (token && typeof token === 'string') {
                    await saveToken(token);
                } else {
                    throw new Error('Token inválido o ausente');
                }
                const storedToken = await AsyncStorage.getItem('jwt_ag');
                console.log('Token almacenado:', storedToken);
                const userRole = responseJson.data.id_rol === 1 ? 'admin' : 'cliente';
                console.log(userRole)
                navigation.navigate('SearchReservationScreen', { userRole, mail: trimmedMail });
                Alert.alert('Bienvenido', userRole === 'admin' ? 'Acceso concedido como Administrador.'
                    : 'No deberias estar aqui, solo administradores');
                if (userRole == "cliente") {
                    navigation.navigate('Login');
                }
            } else {
                Alert.alert('Error', responseJson.message || 'Error Desconocido');
            }
        } catch (error) {
            const storedToken = await AsyncStorage.getItem('jwt_ag');
            console.log('Token almacenado en catch:', storedToken);
            console.error('Error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajusta para iOS y Android
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <LinearGradient colors={['#F0F4FF', '#A0C4FF']} style={styles.containerlogin}>
                    <Image source={require('./Styles/Logo.png')} style={styles.logo} />
                    <Text style={styles.titlelogin}>Iniciar Sesión</Text>
                    <TextInput
                        label="Correo"
                        value={mail}
                        onChangeText={setMail}
                        mode="outlined" 
                        style={styles.inputlogin}
                        outlineColor="#A0C4FF" 
                        activeOutlineColor="#007AFF" 
                    />
                    <TextInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.inputlogin}
                        outlineColor="#A0C4FF"
                        activeOutlineColor="#007AFF"
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color="#A0C4FF" />
                    ) : (
                        <Button
                            icon="login"
                            mode="contained" 
                            onPress={handleLogin}
                            contentStyle={styles.buttonContent}
                            style={styles.buttonlogin}
                            labelStyle={styles.buttonTextlogin} 
                        >
                            Iniciar Sesión
                        </Button>
                    )}
                </LinearGradient>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

