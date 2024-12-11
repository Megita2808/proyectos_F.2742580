import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { Card } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import styles from "./Styles/Styles";
import { approveReservationById, denyReservationById, annularReservationById } from "./hook/StatusChange";
import Header from './hook/headersearch';
import 'react-native-gesture-handler';

export default function SearchReservationScreen({ navigation }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [reasonModalVisible, setReasonModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedReservation2, setSelectedReservation2] = useState(null);
    const [reason, setReason] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [allReservations, setAllReservations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener las reservas');
            }
            const data = await response.json();
            const reservations = data.body;
            setAllReservations(reservations);
            setFilteredReservations(reservations);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReservations();
        }, [])
    );

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleSearch = (text) => {
        setSearchTerm(text);
        const searchText = text.trim().toLowerCase();
        const searchId = isNaN(Number(searchText)) ? null : Number(searchText);
        const filtered = allReservations.filter((reservation) => {
            const reservationId = reservation.id_reservation; 
            return (
                reservation.city.toLowerCase().includes(searchText) ||
                reservation.neighborhood.toLowerCase().includes(searchText) ||
                reservation.status.toLowerCase().includes(searchText) ||
                (searchId !== null && reservationId === searchId) || 
                reservation.name_client.toLowerCase().includes(searchText)
            );
        });
        setFilteredReservations(filtered);
    };

    const handleButtonClick = (status, item) => {
        console.log("datos de item: ", item);
        setSelectedReservation(item);
        setCurrentStatus(status);
        if (status === 'Denegado' || status === 'Anulado') {
            setModalVisible(false);
            setReasonModalVisible(true);
        } else {
            updateReservation(status, item);
        }
    };

    const updateReservation = async (status, reservation) => {
        try {
            const updatedReservation = { ...reservation, status };
            const updatedReservation2 = { ...selectedReservation, status };
            setSelectedReservation2(updatedReservation2);
            let success = false;
            condicional = 0
            switch (status) {
                case 'Aprobado':
                    success = await approveReservationById(reservation.id_reservation);
                    fetchReservations();
                    break;
                case 'Denegado':
                    success = await denyReservationById(selectedReservation2.id_reservation, reason);
                    await fetchReservations();
                    break;
                case 'Anulado':
                    success = await annularReservationById(selectedReservation2.id_reservation, reason);
                    await fetchReservations();
                    break;
                case 'Finalizado':
                    condicional = 1
                    navigation.navigate('Admin-Devolucion', {
                        selectedReservation: updatedReservation,
                        products: updatedReservation.details,
                    });
                    console.log("Datos enviados:", updatedReservation);
                    break;
                default:
                    break;
            }
            if (condicional === 1) {
                console.log("no se necesita una alerta")
                condicional = 0
            } else {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Reserva Actualizada',
                    textBody: `La reserva fue Actualizada con éxito.`,
                    button: 'Cerrar',
                });
            } setReason('');
        } catch (error) {
            console.error('Error:', error);
            try {
                const errorData = JSON.parse(error.message);
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error al aprobar la reserva",
                    textBody: errorData.message || "Ha ocurrido un error al procesar la reserva.",
                    button: 'Cerrar',
                });
            } catch (e) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error Desconocido",
                    textBody: "Ha ocurrido un error inesperado.",
                    button: 'Cerrar',
                });
            }
        }
    };

    const refreshReservations = () => {
        setRefreshing(true);
        fetchReservations();
    };

    const getButtonColor = (status) => {
        switch (status) {
            case 'Aprobado':
                return '#28A745';
            case 'Anulado':
                return '#6C757D';
            case 'Denegado':
                return '#DC3545';
            case 'Finalizado':
                return '#FFC107';
            default:
                return '#007BFF';
        }
    };

    const getTextColor = (status) => {
        switch (status) {
            case 'Aprobada':
                return '#28A745';
            case 'Anulada':
                return '#6C757D';
            case 'Denegada':
                return '#DC3545';
            case 'Finalizada':
                return '#FFC107';
            default:
                return '#007BFF';
        }
    };

    const getAvailableStatuses = (reservationStatus) => {
        const statuses = ['Aprobado', 'Anulado', 'Denegado', 'Finalizado'];
        if (reservationStatus === 'En Espera') {
            return statuses.filter(status => status !== 'Anulado' && status !== 'Finalizado');
        } else if (reservationStatus === 'Aprobada') {
            return statuses.filter(status => status !== 'Aprobado' && status !== 'Denegado');
        } else if (['Denegada', 'Finalizada', 'Anulada'].includes(reservationStatus)) {
            return [];
        }
        return statuses;
    };

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <LinearGradient colors={['#F0F4FF', '#A0C4FF']} style={styles.containersearch}>
                <Text style={styles.titlesearch}>Buscar Reserva</Text>
                <TextInput
                    label="Buscar por nombre o código de reserva"
                    value={searchTerm}
                    mode="outlined"
                    style={styles.searchInput}
                    onChangeText={handleSearch}
                    outlineColor="#A0C4FF"
                    activeOutlineColor="#007AFF"
                />
                {loading ? (
                    <Text>Cargando datos...</Text>
                ) : filteredReservations.length > 0 ? (
                    <FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            paddingHorizontal: 10,
                        }}
                        numColumns={1}
                        data={filteredReservations}
                        keyExtractor={(item) =>
                            item.id_reservation ? item.id_reservation.toString() : Math.random().toString()}
                        renderItem={({ item }) => {
                            const availableStatuses = getAvailableStatuses(item.status);
                            return (
                                <Card style={styles.card}>
                                    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text variant="titleMedium" style={styles.cardTitle}>
                                                ID: {item.id_reservation}
                                            </Text>
                                            <Text variant="bodyMedium" style={styles.cardContent}>
                                                Cliente: {item.name_client}
                                            </Text>
                                            <Text variant="bodyMedium" style={styles.cardContent}>
                                                Ciudad: {item.city}
                                            </Text>
                                            <Text
                                                variant="bodyMedium"
                                                style={[
                                                    styles.cardStatus,
                                                    { color: getTextColor(item.status) },]}>
                                                Estado: {item.status}
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            {availableStatuses.map((status) => (
                                                <TouchableOpacity
                                                    key={status}
                                                    style={[
                                                        styles.statusButton,
                                                        { backgroundColor: getButtonColor(status) },
                                                    ]}
                                                    onPress={() => handleButtonClick(status, item)}>
                                                    <Text style={styles.buttonText}>{status}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </Card.Content>
                                </Card>
                            );
                        }}
                        refreshing={refreshing}
                        onRefresh={refreshReservations}
                    />
                ) : (
                    <Text>No hay reservas disponibles</Text>
                )}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={reasonModalVisible}
                    onRequestClose={() => setReasonModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContentreser}>
                            <Text style={styles.modalTitle}>Razón para {currentStatus}</Text>
                            <TextInput
                                style={styles.inputrazon}
                                placeholder="Escribe la razón..."
                                value={reason}
                                onChangeText={setReason}
                            />
                            <View style={styles.buttonContainerReason}>
                                <TouchableOpacity
                                    style={styles.closeButtonReason}
                                    onPress={() => setReasonModalVisible(false)}
                                >
                                    <Text style={styles.buttonTextReason}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.statusButtonReason}
                                    onPress={() => {
                                        if (reason.trim() === "") {
                                            alert("Por favor, ingresa una razón.");
                                        } else {
                                            setReasonModalVisible(false);
                                            updateReservation(currentStatus, reason);
                                        }
                                    }}
                                >
                                    <Text style={styles.buttonTextReason}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </View>
    );
}
