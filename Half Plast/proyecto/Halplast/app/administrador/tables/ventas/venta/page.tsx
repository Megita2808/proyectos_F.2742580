"use client";

import React, { useEffect, useState } from "react";
import TablaVenta from "@/components/administrador/tablas/ventas/ventas";
import { getVentas , DetalleVenta, Usuario  } from "@/service/api/ventas/todoVenta";
import { formatearFecha } from "@/components/administrador/tablas/funcionesGlobales/formatearFecha";
  

const MyPage: React.FC = () => {
    const [data, setData] = useState<{
        col1: number;
        _id: string;
        detalleVenta: DetalleVenta;
        tipoVenta: string;
        usuario: Usuario;
        fechaVenta: string;
        fechaEntrega: string;
        totalVenta: number;
        estado: boolean;
    }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchVentas = async () => {
        try {
            setIsLoading(true);
            const response  = await getVentas();

            if (Array.isArray(response) && response.length > 0) {
                const ventas = response;
                const formattedData = ventas.map((venta, index) => {
                    const FechaVenta = venta.fechaVenta
                    ? formatearFecha(venta.fechaVenta)
                    : "Sin fecha de venta";
                  
                    const FechaEntrega = venta.fechaEntrega
                    ? formatearFecha(venta.fechaEntrega, true)
                    : "Sin fecha de entrega";
                    const estado = venta.estado || false;
                    
                    let TotalVenta = 0;
                    
                    if (Array.isArray(venta.detalleVenta.medidasProducto)) {
                        TotalVenta += venta.detalleVenta.medidasProducto.reduce(
                            (acc: number, medidaProducto: any) => acc + (medidaProducto.total || 0), 0
                        );
                    }
                    
                    if (Array.isArray(venta.detalleVenta.medidasVenta)) {
                        TotalVenta += venta.detalleVenta.medidasVenta.reduce(
                            (acc: number, medidaVenta: any) => acc + (medidaVenta.total || 0), 0
                        );
                    }
            
                    return {
                        col1: index + 1,
                        _id: venta._id,
                        detalleVenta: venta.detalleVenta,
                        tipoVenta: venta.tipoVenta,
                        usuario: venta.usuario,
                        fechaVenta: FechaVenta,
                        fechaEntrega: FechaEntrega,
                        totalVenta: TotalVenta,
                        estado,
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
        fetchVentas();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Ventas</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaVenta data={data} setRefreshData={fetchVentas} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
