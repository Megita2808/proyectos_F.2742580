"use client";

import React, { useEffect, useState } from "react";
import TablaImagenes from "@/components/administrador/tablas/imagenes";
import { getImagenes } from "@/service/api/img/TodoImagen";

interface ImagenData {
    col1: number;
    col2: string;
    col3: string;
    dataColum: string;
    col4: string; 
    uploadedAt: Date; 
    col6: string;
    col7: string; 
    enabled: boolean; 
}

const MyPage: React.FC = () => {
    const [data, setData] = useState<ImagenData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategorias = async () => {
        try {
            setIsLoading(true);
            const modulos = await getImagenes();
            let contador = 1;
    
            const formattedData: ImagenData[] = modulos.flatMap((modulo) =>
                modulo.images.map((imagen) => {
                    const currentCount = contador;
                    contador++;
    
                    return {
                        col1: currentCount,
                        col2: modulo.moduleName,
                        col3: imagen._id,
                        dataColum: imagen.imageUrl,
                        col4: imagen.description || "",
                        uploadedAt: imagen.uploadedAt,
                        col6: imagen.githubPath,
                        col7: imagen.altText || "",
                        enabled: imagen.isActive
                    };
                })
            );
    
            setData(formattedData);
        } catch (error) {
            console.error("Error obteniendo las imágenes:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Imágenes</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaImagenes data={data} setRefreshData={fetchCategorias} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
