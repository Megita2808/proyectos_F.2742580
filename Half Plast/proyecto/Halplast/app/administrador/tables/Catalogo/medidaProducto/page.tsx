"use client";

import React, { useEffect, useState } from "react";
import TablaMedidaProductos from "@/components/administrador/tablas/catalogo/medidaProducto";
import { getMedidaProducto, PrecioVenta } from "@/service/api/catalogo/medidaProducto/TodoMedidaProducto";

const MyPage: React.FC = () => {
    const [data, setData] = useState<{ 
        col1: number; 
        id: string; 
        producto: string;  
        longitudMedidaModificado: string; 
        costoMedida: number; 
        pesoModificado: string; 
        unidadMedida: string; 
        precioUnitarioModificado: string; 
        enabled: boolean 
        peso: number; 
        unidadMedidaSimbolo: string; 
        idUnidadMedidaPeso: string; 
        longitud: number; 
        precioUnitario: number; 
        idProducto: string;
        idUnidadMedida: string;
        idPeso: string;
        idPrecioUnitario: string;
        existenciasCantidad: number;
        existenciasEquivalenciaSigno: string;
        existenciasEquivalencia: number;
        coloresCompleto: PrecioVenta[];
    }[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    
    const obtenerMultiplicador = (unidadPeso: string, unidadCosto: string ) => {
        if (unidadPeso === 'gm') {
          if (unidadCosto === 'gm') return 1;
          if (unidadCosto === 'Kg') return 0.001;
          if (unidadCosto === 'Tn') return 0.000001;
        } else if (unidadPeso === 'Kg') {
          if (unidadCosto === 'gm') return 1000;
          if (unidadCosto === 'Kg') return 1;
          if (unidadCosto === 'Tn') return 0.001;
        } else if (unidadPeso === 'Tn') {
          if (unidadCosto === 'gm') return 1000000;
          if (unidadCosto === 'Kg') return 1000;
          if (unidadCosto === 'Tn') return 1;
        }
        return 1;
    };

    const fetchMedidasProducto = async () => {
        try {
          setIsLoading(true);
          const medidasProducto = await getMedidaProducto();

          const formattedData = medidasProducto.map((medidaProducto, index) => {
            const precioUnitario = medidaProducto.colores[0]?.PrecioVenta?.precioUnitario || 0;
            const peso = medidaProducto.peso?.valores[0]?.valor?.peso || 0;
            const longitud = medidaProducto.longitudMedida?.valor || 1;
            const pesoUnidadSimbolo = medidaProducto.peso?.unidadMedida?.simbolo || 'sin simbolo';
            const longitudUnidadSimbolo = medidaProducto.longitudMedida?.unidadMedida?.simbolo || 'sin simbolo';


            const costoMedida = precioUnitario * 
            (
                obtenerMultiplicador(medidaProducto.peso.unidadMedida?.simbolo || '', medidaProducto.colores[0].PrecioVenta.unidadMedida?.simbolo || '') 
                *
                (
                  medidaProducto.peso?.unidadMedida?.simbolo === 'Unic'
                      ? (medidaProducto.longitudMedida?.valor || 1) 
                      : (medidaProducto.peso?.valores[0]?.valor?.peso === 0 ? 1 : medidaProducto.peso?.valores[0]?.valor?.peso) || 1
                )
            );
      
            return {
              col1: index + 1,
              id: medidaProducto._id,
              producto: medidaProducto.producto?.nombreProducto || "Sin producto",
              longitudMedidaModificado: `${longitud} ${longitudUnidadSimbolo}`,
              costoMedida,
              pesoModificado: `${peso} ${pesoUnidadSimbolo}`,
              unidadMedida: medidaProducto?.longitudMedida?.unidadMedida?.nombre || "Sin unidad medida",
              precioUnitarioModificado: `${precioUnitario} X ${medidaProducto.colores[0]?.PrecioVenta?.unidadMedida?.simbolo || "sin simbolo"}`,
              enabled: medidaProducto.estado,
              peso,
              longitud,
              precioUnitario,
              unidadMedidaSimbolo: medidaProducto.colores[0]?.PrecioVenta?.unidadMedida?.simbolo || "Sin simbolo",
              idUnidadMedidaPeso: medidaProducto.peso?.unidadMedida?._id || "sin identificador",
              idProducto: medidaProducto.producto?.idProducto || "sin identificador",
              idUnidadMedida: medidaProducto.longitudMedida?.unidadMedida?._id || "vacio",
              idPeso: medidaProducto.peso?.valores[0]?.valor?._id || medidaProducto.peso?.valores[0]?._id || "sin identificador",
              idPrecioUnitario: medidaProducto.colores[0]?.PrecioVenta?._id || "vacio",
              existenciasCantidad: medidaProducto.colores[0]?.existencias.cantidad,
              existenciasEquivalenciaSigno: medidaProducto.colores[0]?.existencias.equivalencia.valor + ' ' + medidaProducto.colores[0]?.existencias.equivalencia.unidadMedida.simbolo,
              existenciasEquivalencia: medidaProducto.colores[0]?.existencias.equivalencia.valor,
              coloresCompleto:  medidaProducto.colores ,
            };
          });
      
          setData(formattedData);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setIsLoading(false);
        }
      };
    
    useEffect(() => {
        fetchMedidasProducto();
    }, []);

    return (
        <div suppressHydrationWarning={true}>
            <div id="root" className="dark:bg-black dark:text-bodydark">
                <h1 className="TituloTabla">Medida producto</h1>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <TablaMedidaProductos data={data} setRefreshData={fetchMedidasProducto} />
                )}
            </div>
        </div>
    );
};

export default MyPage;
