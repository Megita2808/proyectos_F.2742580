import React, { useState } from "react";

interface TerminosYCondicionesModalProps {
  isOpen: boolean;
  onSelect: (resultado: boolean) => void;
}

const TerminosYCondicionesModal: React.FC<TerminosYCondicionesModalProps> = ({
  isOpen,
  onSelect,
}) => {
  const [aceptado, setAceptado] = useState(false);

  if (!isOpen) return null;

  const handleAceptar = () => {
    onSelect(true);
  };

  const handleCerrar = () => {
    onSelect(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "600px",
          padding: "24px",
          position: "relative",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Términos y Condiciones
        </h2>
        <div
          style={{
            color: "#4a5568",
            marginBottom: "24px",
            overflowY: "auto",
            maxHeight: "320px",
            border: "1px solid #e2e8f0",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>
            1. Tratamiento de Datos Personales
          </h3>
          <p style={{ marginBottom: "8px" }}>
            En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013,
            HalPlast recolecta, almacena y utiliza datos personales únicamente
            para los fines relacionados con la prestación de servicios y ventas,
            como la gestión de envíos y promociones.
          </p>
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>
            2. Condiciones de Venta
          </h3>
          <p style={{ marginBottom: "8px" }}>
            Al realizar una compra, aceptas que HalPlast utilice los datos
            proporcionados para procesar tu pedido. Es responsabilidad del
            cliente proporcionar información veraz y actualizada.
          </p>
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>
            3. Consentimiento
          </h3>
          <p style={{ marginBottom: "8px" }}>
            Al aceptar estos términos, consientes el tratamiento de tus datos
            personales y recibir información comercial de HalPlast.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              style={{
                marginRight: "8px",
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
              checked={aceptado}
              onChange={(e) => setAceptado(e.target.checked)}
            />
            <span style={{ color: "#4a5568" }}>
              Acepto los términos y condiciones
            </span>
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#e2e8f0",
                color: "#4a5568",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleCerrar}
            >
              Cancelar
            </button>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: aceptado ? "#3182ce" : "#e2e8f0",
                color: aceptado ? "#ffffff" : "#a0aec0",
                border: "none",
                borderRadius: "4px",
                cursor: aceptado ? "pointer" : "not-allowed",
                fontWeight: "600",
              }}
              disabled={!aceptado}
              onClick={handleAceptar}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosYCondicionesModal;
