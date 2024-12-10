"use client";

import React, { useEffect, useState } from "react";
import TablaMedidaVenta from "@/components/administrador/tablas/catalogo/medidaVenta";
import { getMedidasVenta } from "@/service/api/catalogo/medidaVenta/TodoMedidaVenta";

import { ColoresInterface, Peso } from '@/components/administrador/tablas/tiposFilas/medidaVenta';

const MyPage: React.FC = () => {
    const [data, setData] = useState<{        
        col1: number; 
        id: string; 
        medidaProducto: string;  
        medidaVenta: string;  
        longitudMedidaModificado: string; 
        unidadMedida: string; 
        precioUnitarioModificado: string; 
        enabled: boolean 
        peso: number; 
        unidadMedidaSimbolo: string; 
        idUnidadMedidaPeso: string; 
        longitud: number; 
        precioUnitario: number; 
        idMedidaProducto: string;
        idUnidadMedida: string;
        idPeso: string;
        idPrecioUnitario: string;
        urlImagen: string;
        datosPesoTodo: Peso;
        datosColoresTodo: ColoresInterface;
    }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const convertirDecimalAFraccion = (valor: number): string => {
        const parteEntera = Math.floor(valor);
        const parteDecimal = valor - parteEntera;
    
        if (parteDecimal === 0) {
            return parteEntera.toString();
        }
    
        const decimalStr = parteDecimal.toString().split('.')[1];
        let denominador = Math.pow(10, decimalStr.length);
        let numerador = Math.round(parteDecimal * denominador);
        const calcularMCD = (a: number, b: number): number => {
            return b === 0 ? a : calcularMCD(b, a % b);
        };
    
        const mcd = calcularMCD(numerador, denominador);
        numerador /= mcd;
        denominador /= mcd;
    
        return parteEntera > 0 ? `${parteEntera} ${numerador}/${denominador}` : `${numerador}/${denominador}`;
    };
      
    const fetchMedidasVenta = async () => {
        try {
            setIsLoading(true);
            const medidasVenta = await getMedidasVenta();
            const formattedData = medidasVenta.map((medidaVenta, index) => ({
                col1: index + 1,
                id: medidaVenta._id,

                urlImagen: medidaVenta.colores[0].imagen || "Sin url de imagen",
                medidaProducto: `${(medidaVenta.medidaProducto?.longitudMedida?.valor || 0) + " " +(medidaVenta.medidaProducto?.longitudMedida?.unidadMedida?.simbolo || "Sin medida producto") }`,
                medidaVenta: `${(medidaVenta.longitudMedida?.unidadMedida?.simbolo === "½"
                    ? convertirDecimalAFraccion(medidaVenta.longitudMedida?.valor || 0) 
                    : medidaVenta.longitudMedida?.valor || 0) + " " + 
                    (medidaVenta.longitudMedida?.unidadMedida?.simbolo === "½" 
                      ? "X " + (medidaVenta.medidaProducto?.longitudMedida?.valor || 0) + " " + (medidaVenta.medidaProducto?.longitudMedida?.unidadMedida?.simbolo || "Sin medida producto") 
                      : (medidaVenta.longitudMedida?.unidadMedida?.simbolo || "Sin medida producto"))}`,
                longitudMedidaModificado: `${(medidaVenta.longitudMedida?.valor || 0) + " " + (medidaVenta.longitudMedida?.unidadMedida?.simbolo || "sin simbolo")}`,
                pesoModificado: `${(medidaVenta.peso?.valores[0]?.valor?.peso || 0) + " " + (medidaVenta.peso?.unidadMedida?.simbolo || "sin simbolo")}`,
                unidadMedida: medidaVenta?.longitudMedida?.unidadMedida?.nombre || "Sin unidad medida",
                precioUnitarioModificado: `${(medidaVenta?.colores[0].PrecioVenta?.precioUnitario || 0) + " X " + (medidaVenta?.peso?.unidadMedida?.simbolo || "sin simbolo")}`,
                
                enabled: medidaVenta.estado,

                datosPesoTodo: medidaVenta.peso || ["", ""] ,
                datosColoresTodo: medidaVenta || ["", ""] ,

                peso: medidaVenta.peso.valores[0]?.valor?.peso || 0,
                longitud: medidaVenta.longitudMedida?.valor || 0,
                precioUnitario: medidaVenta?.colores[0].PrecioVenta?.precioUnitario || 0,
                unidadMedidaSimbolo: medidaVenta?.colores[0].PrecioVenta?.unidadMedida?.simbolo || "Sin simbolo",

                idUnidadMedidaPeso: medidaVenta.peso?.unidadMedida?._id || "sin identificador", 
                idMedidaProducto: medidaVenta.medidaProducto?.idMedidaProducto || "sin identificador" ,
                idUnidadMedida: medidaVenta.longitudMedida?.unidadMedida?._id || "vacio" ,
                idPeso: medidaVenta.peso.valores[0]?.valor?._id || medidaVenta.peso.valores[0]?._id || "sin identificador",
                idPrecioUnitario : medidaVenta.colores[0].PrecioVenta?._id ||  "vacio"  
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error obteniendo las medidas de venta:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedidasVenta();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Medidas de venta</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaMedidaVenta data={data} setRefreshData={fetchMedidasVenta} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
