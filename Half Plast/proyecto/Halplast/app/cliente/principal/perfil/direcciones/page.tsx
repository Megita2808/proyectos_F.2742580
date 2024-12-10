"use client";

import React, { useEffect, useState } from "react";
import { store } from '@/redux/store';

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

interface DireccionesData {
  tipo: string;
  locaciones: LocacionesPorCiudad[];
}

const DireccionesPage: React.FC = () => {
  const state = store.getState(); 

  const [direcciones, setDirecciones] = useState<DireccionesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirecciones = async () => {
      if (!state) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://apihalplast.onrender.com/api/direcciones/usuario/${state.user.name}`,
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
        const data: DireccionesData = await response.json();
        setDirecciones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDirecciones();
  }, []);

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

  if (!direcciones) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No se encontraron datos de direcciones.
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Direcciones de Usuario
      </h1>
      {direcciones.locaciones.map((locacionPorCiudad, index) => (
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
            {locacionPorCiudad.departamento} - {locacionPorCiudad.ciudad}
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {locacionPorCiudad.locaciones.map((locacion) => (
              <li
                key={locacion._id}
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div>
                  <strong>Dirección:</strong> {locacion.locacion}
                </div>
                <div>
                  <strong>Coordenadas:</strong>{" "}
                  {locacion.coordenadas.latitud}, {locacion.coordenadas.longitud}
                </div>
                <div>
                  <strong>Estado:</strong>{" "}
                  {locacion.estado ? "Activo" : "Inactivo"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DireccionesPage;