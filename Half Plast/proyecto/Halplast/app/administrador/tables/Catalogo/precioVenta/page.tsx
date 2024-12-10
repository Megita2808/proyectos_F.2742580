"use client";

import React, { useEffect, useState } from "react";
import TablaPrecioVenta from "@/components/administrador/tablas/catalogo/precioVenta/precioVenta";
import { getPreciosVenta } from "@/service/api/precioVenta/TodoPrecioVenta";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; col2: number; col3: string; col4: string; col5: string; col6: string;col7: string; enabled: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPreciosVenta = async () => {
        try {
            setIsLoading(true);
            const preciosVenta = await getPreciosVenta();
            
            const formattedData = preciosVenta.map((precioVenta, index) => ({
                col1: index + 1,
                col2: precioVenta.precioUnitario,
                col4: precioVenta.color?.nombreColor || "Sin color",
                col5: precioVenta.unidadMedida?.nombre || "Sin símbolo",
                enabled: precioVenta.estado,
                col3: precioVenta._id,
                col6: precioVenta.color?._id || "Sin id de color",
                col7: precioVenta.unidadMedida?._id || "Sin ide de unidad de medida",
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching precios de venta:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPreciosVenta();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Precio</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaPrecioVenta data={data} setRefreshData={fetchPreciosVenta} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
