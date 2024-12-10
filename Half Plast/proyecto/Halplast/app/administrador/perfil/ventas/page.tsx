"use client";
import Button from "@mui/material/Button/Button";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { store } from '@/redux/store';

Modal.setAppElement("#root");
interface Peso {
    valor: number;
    unidad: string;
}
interface Longitud {
    ancho?: number;
    largo?: number;
}
interface MedidaProducto {
    medida: string;
    longitud: Longitud | number;
    Peso: Peso | null;
    color: string;
    cantidad: number;
    total: number;
    _id: string;
}
interface DetalleVenta {
    medidasProducto: MedidaProducto[];
}
interface Usuario {
    _id: string;
    nombre: string;
    correo: string;
}
interface Venta {
    _id: string;
    tipoVenta: string;
    subTotal: number;
    usuario: Usuario;
    fechaEntrega: string;
    detalleVenta: DetalleVenta;
}
const SalesList: React.FC = () => {
    const state = store.getState(); 

    const [salesData, setSalesData] = useState<Venta[]>([]);
    const [selectedSale, setSelectedSale] = useState<Venta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            if (!state) return;
            setLoading(true);
            try {
                const response = await fetch(
                    `https://apihalplast.onrender.com/api/ventas/usuario/correo/${state.user.name}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(`Error al obtener datos: ${response.statusText}`);
                }
                const data = await response.json();
                setSalesData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };
        fetchSalesData();
    }, [state]);
    const openModal = (sale: Venta) => {
        setSelectedSale(sale);
    };
    const closeModal = () => {
        setSelectedSale(null);
    };
    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "20px" }}>Cargando datos...</div>;
    }
    if (error) {
        return (
            <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
                Error: {error}
            </div>
        );
    }
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
                Lista de Ventas
            </h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {salesData.map((sale) => (
                    <li
                        key={sale._id}
                        style={{
                            background: "#f9f9f9",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "15px",
                            transition: "box-shadow 0.3s",
                        }}
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                            "0 4px 8px rgba(0, 0, 0, 0.1)")
                        }
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                    >
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Tipo de Venta:</strong> {sale.tipoVenta}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Subtotal:</strong> ${sale.subTotal.toLocaleString()}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Fecha de Entrega:</strong>{" "}
                            {new Date(sale.fechaEntrega).toLocaleDateString()}
                        </div>
                        <Button
                            variant="contained"
                            onClick={() => openModal(sale)}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#2c8ad9",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                transition: "background-color 0.3s",
                            }}
                        >
                            Ver Detalles
                        </Button>
                    </li>
                ))}
            </ul>
            {selectedSale && (
                <SalesModal sale={selectedSale} onClose={closeModal} />
            )}
        </div>
    );
};
const SalesModal: React.FC<{
    sale: Venta;
    onClose: () => void;
}> = ({ sale, onClose }) => {
    return (
        <Modal
            isOpen={!!sale}
            onRequestClose={onClose}
            contentLabel="Detalles de la Venta"
            style={{
                content: {
                    maxWidth: "600px",
                    margin: "auto",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ddd",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Detalles de la Venta
            </h2>
            <Button
                variant="contained"
                onClick={onClose}
                style={{
                    display: "block",
                    margin: "0 auto 20px",
                    padding: "10px 20px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s",
                }}
            >
                Cerrar
            </Button>
            <div style={{ marginBottom: "10px" }}>
                <strong>Tipo de Venta:</strong> {sale.tipoVenta}
            </div>
            <div style={{ marginBottom: "10px" }}>
                <strong>Subtotal:</strong> ${sale.subTotal.toLocaleString()}
            </div>
            <div>
                <strong>Detalle de Productos:</strong>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {sale.detalleVenta.medidasProducto.map((item) => (
                        <li
                            key={item._id}
                            style={{
                                background: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            <div>
                                <strong>Medida:</strong> {item.medida}
                            </div>
                            <div>
                                <strong>Longitud:</strong>{" "}
                                {typeof item.longitud === "object"
                                    ? `${item.longitud.ancho} x ${item.longitud.largo}`
                                    : item.longitud}
                            </div>
                            <div>
                                <strong>Peso:</strong>{" "}
                                {item.Peso?.valor
                                    ? `${item.Peso.valor} ${item.Peso.unidad}`
                                    : "N/A"}
                            </div>
                            <div>
                                <strong>Cantidad:</strong> {item.cantidad}
                            </div>
                            <div>
                                <strong>Total:</strong> ${item.total.toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
};
export default SalesList;