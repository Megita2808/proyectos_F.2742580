import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './screens/hook/AuthContext';
import LoginScreen from './screens/login';
import ScreenAdminDevolucion from './screens/Admindevolucion';
import SearchReservationScreen from './screens/SearchReserve';
import 'react-native-gesture-handler';
import { AlertNotificationRoot } from 'react-native-alert-notification';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SearchReservationScreen" component={SearchReservationScreen} options={{ title: 'Buscar Reserva', headerShown: false }} />
            <Stack.Screen name="Admin-Devolucion" component={ScreenAdminDevolucion} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </AlertNotificationRoot>
  );
}