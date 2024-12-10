"use client";

import React, { useEffect, useState } from "react";
import TablaCompras from "@/components/administrador/tablas/compras/compra/compra";
import { getCompras } from "@/service/api/compra/Compra/TodoCompra";
import { CompraDetalleGet } from "@/components/administrador/tablas/tiposFilas/compra";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{
        col1: number;
        _id: string;
        detalleCompra: CompraDetalleGet[];
        fechaCompra: string;
        totalCompra: number;
        estado: boolean;
    }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchCompras = async () => {
        try {
            setIsLoading(true);
            const compras = await getCompras();

            const formattedData = compras.map((compra, index) => {
                const fechaCompra = compra.fechaCompra || "Sin fecha";
                const estado = compra.estado || false;
                const totalCompra = compra.detalleCompra.reduce(
                    (acc, detalle) => acc + detalle.total, 0
                );

                return {
                    col1: index + 1,
                    _id: compra._id,
                    detalleCompra: compra.detalleCompra,
                    fechaCompra,
                    totalCompra,
                    estado,
                };
            });

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching purchases:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompras();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Compras</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaCompras data={data} setRefreshData={fetchCompras} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
