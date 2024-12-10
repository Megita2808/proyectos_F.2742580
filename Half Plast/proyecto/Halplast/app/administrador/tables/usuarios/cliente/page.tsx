"use client";

import React, { useEffect, useState } from "react";
import TablaUsuarios from "@/components/administrador/tablas/usuario/clientes/cliente";
import { getClientes, dataRol } from "@/service/api/usuarios/TodoCliente";
import { Direccion } from "@/service/api/compra/proveedor/TodoProveedor";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ col1: number; identificador: string; nombre: string; correo:string; telefono: string, rol: dataRol, nombreRol: string, enabled: boolean, direccion: Direccion[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClientes= async () => {
        try {
            setIsLoading(true);
            const clientes = await getClientes();
            const formattedData = clientes.map((cliente, index) => ({
                col1: index + 1,
                identificador: cliente._id,
                nombre: cliente.nombre,
                correo: cliente.correo,
                telefono: cliente.telefono,
                rol: cliente.rol,
                nombreRol: cliente.rol.nombreRol,
                enabled: cliente.estado,
                direccion: cliente.direccion,
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
                <h1 className="TituloTabla">Usuarios</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaUsuarios data={data} setRefreshData={fetchClientes} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
