"use client";

import React, { useEffect, useState } from "react";
import TablaProveedores from "@/components/administrador/tablas/compras/proveedor/proveedor";
import { getProveedores, Direccion } from "@/service/api/compra/proveedor/TodoProveedor";
import { formatDate } from "date-fns";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; identificador: string; nombre: string; correo:string; telefono: string; numeroDocumento: string; tipoDocumento: string; enabled: boolean; direccion: Direccion[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClientes= async () => {
        try {
            setIsLoading(true);
            const proveedores = await getProveedores();
            const formattedData = proveedores.map((proveedor, index) => ({
                col1: index + 1,
                identificador: proveedor._id,
                nombre: proveedor.nombre,
                correo: proveedor.correo,
                telefono: proveedor.telefono,
                numeroDocumento: proveedor.documento,
                tipoDocumento: proveedor.tipoDocumento,
                enabled: proveedor.estado,
                direccion: proveedor.direccion
            }));
            setData(formattedData)
        } catch (error) {
            console.error("Error obteniendo los clientes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Proveedores</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaProveedores data={data} setRefreshData={fetchClientes} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
