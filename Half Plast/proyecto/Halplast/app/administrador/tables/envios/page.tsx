"use client";

import React, { useEffect, useState } from "react";
import TablaEnvios from "@/components/administrador/tablas/envios/envios";
import { getEnvios , Envios, Usuario, CiudadData, Ventas  } from "@/service/api/envios/todoEnvios";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{
        col1: number;
        _id: string;
        estadoEnvio: string;
        totalEnvio: number;
        direccion: string;
        locaciones: CiudadData;
        usuario: Usuario;
        detalleVenta: Ventas;
    }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchEnvios = async () => {
        try {
            setIsLoading(true);
            const response  = await getEnvios();

            if (response && Array.isArray(response.envios) && response.envios.length > 0) {
                const formattedData = response.envios.map((envio, index) => {
                    const detalleVenta = envio.venta || {};
                    const subTotal = detalleVenta.subTotal ;

                    return {
                        col1: index + 1,
                        _id: envio._id,
                        estadoEnvio: envio.estadoEnvio,
                        totalEnvio: subTotal + (envio.totalEnvio || 0),
                        direccion: envio.direccion,
                        locaciones: envio.locaciones,
                        usuario: envio.usuario,
                        detalleVenta,
                    };

                });
    
                setData(formattedData);
            } else {
                console.error('No se recibieron ventas o la estructura es incorrecta');
            }
        } catch (error) {
            console.error("Error fetching purchases:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnvios();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Envios</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaEnvios data={data} setRefreshData={fetchEnvios} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
