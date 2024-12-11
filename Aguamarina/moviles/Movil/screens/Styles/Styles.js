import { registerCallableModule, StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    //Global
    logo: {
        position: 'absolute',
        top: 60,
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    //termina

    //estilos reserve
    containerreserve: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F4FF',
        padding: 0,
    },
    titlereserve: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 15,
    },
    tableRowreserve: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 6,
        borderRadius: 8,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: '#A0C4FF',
        width: '100%',
    },
    tableColumnreserve: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        wordBreak: 'break-word',
        flexWrap: 'wrap',
    },
    inputreserve: {
        Color: "#B0B0B0",
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#A0C4FF',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 1,
        width: -10,
        fontSize: 12,
    },
    modalContainerreserve: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentreserve: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalTitlereserve: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 15,
    },
    modalInputreserve: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#A0C4FF',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
    },
    modalButtonsreserve: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonreserve: {
        flex: 1,
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 3,
    },
    cancelButtonreserve: {
        backgroundColor: '#FF6B6B',
    },
    buttonTextreserve: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    buttonConfirmReserve: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonConfirmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    columnContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: "3%",
        marginLeft: "-2%"
    },
    textCantidad: {
        fontSize: 14,
        color: '#333',
    },
    //termina

    //Estilos Modal estado
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    textoBoton: {
        color: '#FFFFFF',
        fontSize: 12,
        marginRight: "0",
        position: "fixed",
        right: "10"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContenido: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 5,
    },
    opcion: {
        padding: 10,
    },
    textoOpcion: {
        fontSize: 16
    },
    //termina

    //estilos del login
    containerlogin: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    titlelogin: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 20,
    },
    inputlogin: {
        width: '100%',
        borderColor: '#A0C4FF',
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
    },
    buttonlogin: {
        backgroundColor: '#007BFF',
        padding: 1,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 12,
        width: '70%',
        height: 60,
    },
    buttonTextlogin: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20
    },
    buttonContent: {
        paddingVertical: 0,
    },
    //termina

    //estilos de search
    containersearch: {
        flex: 1,
        backgroundColor: '#F0F4FF',
        padding: 20,
    },
    titlesearch: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 20,
    },
    searchInput: {
        width: '100%',
        padding: 0,
        marginBottom: 10,
        borderColor: '#A0C4FF',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#A0C4FF',
        width: '100%',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    cardStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    reservationStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28A745',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 0,
    },
    modalButtonSpacer: {
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: -10,
        padding: 0,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        minWidth: '100%',
        maxWidth: '50%',
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        margin: 0
    },
    closeButton: {
        marginTop: 55,
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: "95%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentreser: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    // Estilos ajustados para la nueva modal
    inputrazon: {
        width: '100%',
        height: 50,
        borderColor: '#A0C4FF',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#333',
    },
    buttonContainerReason: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    statusButtonReason: {
        flex: 1,
        marginLeft: 5,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007BFF',
    },
    buttonTextReason: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButtonReason: {
        flex: 1,
        marginRight: 5,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF5C5C',
    },
    modalContentreser: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    razonButton: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        minWidth: '80%',
        maxWidth: '95%',
        backgroundColor: '#007BFF',
        marginBottom: -50
    },
    //termina
});
