"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { store } from "@/redux/store";

const getUserData = async (userId: string) => {
  try {
    const response = await fetch(
      `https://apihalplast.onrender.com/api/usuarios/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo obtener los datos del usuario.`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error al obtener los datos: ${error instanceof Error ? error.message : "Desconocido"}`);
  }
};

const Perfil = () => {
  const state = store.getState(); 
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!state) return;

      setLoading(true);
      try {
        const data = await getUserData(state.user.name);
        setUserData(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [state]);

  if (loading) {
    return <p className="text-center text-blue-500">Cargando...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <Link
          href="/login"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  if (!userData) {
    return <p className="text-center text-gray-500">No se encontraron datos para este usuario.</p>;
  }

  const { nombre, correo, rol, fotoPerfil } = userData;


  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
        {/* Encabezado */}
        <header className="relative bg-gradient-to-br from-purple-600 to-pink-500 text-white text-center py-16">
          <div className="relative inline-block">
            <img
              src={fotoPerfil || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
              alt={`Foto de perfil de ${nombre}`}
              className="w-48 h-48 rounded-full border-4 border-white shadow-lg mx-auto object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold mt-4">{nombre}</h1>
          <p className="text-sm opacity-90">{rol?.nombreRol || "Sin rol asignado"}</p>
        </header>

        {/* Contenido */}
        <div className="p-8 text-gray-700">
          <div className="flex justify-center">
            <div className="mb-6 bg-stone-100 rounded-lg shadow-inner p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4 text-center">Detalles del Usuario</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nombre:</span> {nombre}
                </p>
                <p>
                  <span className="font-medium">Correo:</span> {correo}
                </p>
                <p>
                  <span className="font-medium">Rol:</span> {rol?.nombreRol || "No asignado"}
                </p>
              </div>
            </div>
          </div>

          {/* Opciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Link
              href="/cliente/principal/perfil/envios"
              className="block bg-indigo-600 text-white text-center py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Ver Envíos
            </Link>
            <Link
              href="/cliente/principal/perfil/direcciones"
              className="block bg-purple-600 text-white text-center py-3 rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Ver Direcciones
            </Link>
            <Link
              href="/cliente/principal/perfil/ventas"
              className="block bg-sky-800 text-white text-center py-3 rounded-lg shadow-md hover:bg-sky-300 transition"
            >
              Ver Ventas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;