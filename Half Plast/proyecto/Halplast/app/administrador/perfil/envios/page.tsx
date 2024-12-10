"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Button from "@mui/material/Button/Button";

import { store } from '@/redux/store';

Modal.setAppElement("#root");

interface Coordenadas {
  latitud: number;
  longitud: number;
}
interface Locacion {
  coordenadas: Coordenadas;
  locacion: string;
  estado: boolean;
  _id: string;
}
interface LocacionesPorCiudad {
  departamento: string;
  ciudad: string;
  locaciones: Locacion[];
}
interface MedidaProducto {
  medida: string;
  longitud: number | { ancho: number; largo: number };
  Peso?: { valor: number; unidad: string } | string;
  color: string;
  cantidad: number;
  total: number;
  _id: string;
}
interface Venta {
  _id: string;
  tipoVenta: string;
  subTotal: number;
  usuario: string;
  fechaVenta: string;
  fechaEntrega: string;
  estado: boolean;
  detalleVenta: {
    medidasProducto: MedidaProducto[];
  };
}
interface Envio {
  _id: string;
  estadoEnvio: string;
  totalEnvio: number;
  venta: Venta;
  direccion: null;
  usuario: string;
}
interface LocacionesPorEnvio {
  envio: Envio;
  locaciones: LocacionesPorCiudad[];
}
interface EnvioData {
  locacionesPorEnvio: LocacionesPorEnvio[];
}
const EnvioPage: React.FC = () => {
  const state = store.getState(); 

  const [envios, setEnvios] = useState<EnvioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnvio, setSelectedEnvio] = useState<Envio | null>(null);

  useEffect(() => {
    const fetchEnvios = async () => {
      if (!state) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://apihalplast.onrender.com/api/envios/${state.user.name}`,
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
        const data: EnvioData = await response.json();
        setEnvios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchEnvios();
  }, [state]);

  const openModal = (envio: Envio) => {
    setSelectedEnvio(envio);
  };
  
  const closeModal = () => {
    setSelectedEnvio(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Cargando datos...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        Error: {error}
      </div>
    );
  }
  if (!envios || envios.locacionesPorEnvio.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No se encontraron datos de envíos.
      </div>
    );
  }
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Información de Envíos
      </h1>
      {envios.locacionesPorEnvio.map((envioInfo, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ marginBottom: "10px", color: "#444" }}>
            Envío: {envioInfo.envio.estadoEnvio}
          </h2>
          <div>
            <strong>Fecha de Venta:</strong>{" "}
            {new Date(envioInfo.envio.venta.fechaVenta).toLocaleDateString()}
          </div>
          <div>
            <strong>Fecha de Entrega:</strong>{" "}
            {new Date(envioInfo.envio.venta.fechaEntrega).toLocaleDateString()}
          </div>
          <div>
            <strong>Total Envío:</strong> ${envioInfo.envio.totalEnvio}
          </div>
          <Button
            variant="contained"
            onClick={() => openModal(envioInfo.envio)}
            style={{
              marginTop: "10px",
              backgroundColor: "#2c8ad9",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Ver Detalles
          </Button>
        </div>
      ))}
      {selectedEnvio && (
        <EnvioModal envio={selectedEnvio} onClose={closeModal} />
      )}
    </div>
  );
};
const EnvioModal: React.FC<{ envio: Envio; onClose: () => void }> = ({ envio, onClose }) => {
  return (
    <Modal
      isOpen={!!envio}
      onRequestClose={onClose}
      contentLabel="Detalles del Envío"
      style={{
        content: {
          maxWidth: "600px",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Detalles del Envío
      </h2>
      <Button
        variant="contained"
        onClick={onClose}
        style={{
          display: "block",
          margin: "0 auto 20px",
          backgroundColor: "#f44336",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Cerrar
      </Button>
      <div style={{ marginBottom: "10px" }}>
        <strong>Total Envío:</strong> ${envio.totalEnvio}
      </div>
      <div>
        <strong>Productos:</strong>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {envio.venta.detalleVenta.medidasProducto.map((producto) => (
            <li
              key={producto._id}
              style={{
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>Medida:</strong> {producto.medida}
              </div>
              <div>
                <strong>Longitud:</strong>{" "}
                {typeof producto.longitud === "object"
                  ? `${producto.longitud.ancho} x ${producto.longitud.largo}`
                  : producto.longitud}
              </div>
              <div>
                <strong>Peso:</strong>{" "}
                {typeof producto.Peso === "object"
                  ? `${producto.Peso.valor} ${producto.Peso.unidad}`
                  : producto.Peso || "N/A"}
              </div>
              <div>
                <strong>Cantidad:</strong> {producto.cantidad}
              </div>
              <div>
                <strong>Total:</strong> ${producto.total}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
export default EnvioPage;