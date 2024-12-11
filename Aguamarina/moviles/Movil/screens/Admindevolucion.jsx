import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Button, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from "./Styles/Styles";
import Header from './hook/header';
import { finalizeReservationById } from "./hook/StatusChange"
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

export default function ScreenAdminEnvio({ route, navigation }) {
    const { selectedReservation, products } = route.params;

    if (!selectedReservation) {      
        return <Text>No hay reserva seleccionada</Text>;
    }

    useEffect(() => {
        console.log("selected: ",selectedReservation)
        console.log("products: ", products)
    }, [selectedReservation, products]);

    const [productosEstado, setProductosEstado] = useState({});
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [malEstadoCantidad, setMalEstadoCantidad] = useState('');
    const [userId, setUserId] = useState(null);

    const fetchUserId = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt_ag');
            if (token) {
                const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/check_cookie', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                const data = await response.json();
                if (data && data.body.id_user) {
                    setUserId(data.body.id_user);
                    console.log(data.body.id_user)
                } else {
                    console.error('No se pudo obtener el ID del usuario');
                }
            }
        } catch (error) {
            console.error("Error al obtener el ID del usuario:", error);
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);


    const handleMalEstadoCantidadChange = (productId, text) => {
        setMalEstadoCantidad(text);
        setProductosEstado(prevState => {
            return {
                ...prevState,
                [productId]: {
                    ...prevState[productId],
                    malEstadoCantidad: text
                }
            };
        });
    };

    function capitalizeFirstLetter(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const breakTextAt = (text, maxLength) => {
        const result = [];
        for (let i = 0; i < text.length; i += maxLength) {
            result.push(text.substring(i, i + maxLength));
        }
        return result;
    };

    const handleConfirm = () => {
        for (let item of selectedReservation.details) {
            const state = productosEstado[item.id_product] || {};
            const cantidadMalEstado = parseInt(state.malEstadoCantidad || 0);
            if (cantidadMalEstado > item.quantity) {
                Alert.alert(
                    "Error",
                    `La cantidad en mal estado: !! ${state.malEstadoCantidad} !! no puede ser mayor a la cantidad reservada \n para la cantidad actual del producto: !! ${item.quantity} !!`,
                    [{ text: "OK" }]
                );
                return;
            }
        }
        setModalVisible(true);
    };
    const handleCancel = () => setModalVisible(false);


    const handleFinalConfirm = async () => {
        const lossesList = Object.entries(productosEstado)
            .filter(([productId, state]) => {
                const cantidad = parseInt(state.malEstadoCantidad || 0);
                return cantidad > 0;
            })
            .map(([productId, state]) => ({
                id_product: parseInt(productId),
                quantity: parseInt(state.malEstadoCantidad.trim()),
            }));
        const requestData = {
            id_user: userId,
            lossesList,
            observations: description,
            loss_date: new Date().toISOString().split('T')[0],
        };
        try {
            await finalizeReservationById(selectedReservation.id_reservation, requestData);
            setModalVisible(false);
            setDescription('');
            navigation.goBack({reload: true}); 
        } catch (error) {
            console.error("Error al finalizar la reserva:", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <LinearGradient colors={['#F0F4FF', '#A0C4FF']} style={styles.containerreserve}>
                <Text style={styles.titlereserve}>Revisión de Reserva - Admin Envío</Text>
                <FlatList
                    data={selectedReservation.details}
                    keyExtractor={(item) => item.id_product.toString()}
                    renderItem={({ item }) => {
                        const product = products.find(p => p.id_product === item.id_product);
                        const productState = productosEstado[item.id_product] || {};
                        const productName = product ? capitalizeFirstLetter(product.name) : `Producto no encontrado`;
                        const brokenProductName = breakTextAt(productName, 17);
                        return (
                            <View style={styles.tableRowreserve}>
                                <View style={styles.tableColumnreserve}>
                                    {brokenProductName.map((line, index) => (
                                        <Text key={index} style={styles.productName}>
                                            {line}
                                        </Text>
                                    ))}
                                </View>
                                <View style={styles.columnContainer}>
                                    <Text style={styles.textCantidad}>Cantidad</Text>
                                    <Text style={styles.textCantidad}>{item.quantity}</Text>
                                </View>
                                <View style={styles.container}>
                                    <TextInput
                                        style={styles.inputreserve}
                                        keyboardType="numeric"
                                        placeholder="Cant. Mal Estado"
                                        value={productState.malEstadoCantidad}
                                        onChangeText={(text) => handleMalEstadoCantidadChange(item.id_product, text)}
                                    />
                                </View>
                            </View>
                        );
                    }}
                />
                <TouchableOpacity style={styles.buttonConfirmReserve} onPress={handleConfirm}>
                    <Text style={styles.buttonConfirmText}>Confirmar</Text>
                </TouchableOpacity>
                {modalVisible && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={handleCancel}
                    >
                        <View style={styles.modalContainerreserve}>
                            <View style={styles.modalContentreserve}>
                                <Text style={styles.modalTitlereserve}>¿Tienes alguna observación?</Text>
                                <TextInput
                                    style={styles.modalInputreserve}
                                    placeholder="Descripción"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                                <View style={styles.modalButtonsreserve}>
                                    <TouchableOpacity style={styles.buttonreserve} onPress={handleFinalConfirm}>
                                        <Text style={styles.buttonTextreserve}>Confirmar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.buttonreserve, styles.cancelButtonreserve]} onPress={handleCancel}>
                                        <Text style={styles.buttonTextreserve}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </LinearGradient>
        </View>
    );
}
