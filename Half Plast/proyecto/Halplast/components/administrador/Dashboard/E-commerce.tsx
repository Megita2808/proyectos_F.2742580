"use client";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import DataCard from "../ElementosTremor/Cards/DataCard";
import DataWave from "../ElementosTremor/waves/DataWave";
import { getDatosDashboard, datosEnvio, datosVenta, datosCompra, datosCategoria } from "@/service/api/dashboard/todoDatosDashboard";

const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

const ECommerce: React.FC = () => {

  const [DatosEnvio, setDatosEnvio] = useState<datosEnvio[]>([]);
  const [DatosVenta, setDatosVenta] = useState<datosVenta[]>([]);
  const [DatosCompra, setDatosCompra] = useState<datosCompra[]>([]);
  const [DatosCategoria, setDatosCategoria] = useState<datosCategoria[]>([]);
  const [TotalVentas, setTotalVentas] = useState<number>(0);
  const [TotalEnvios, setTotalEnvios] = useState<number>(0);
  const [TotalCompras, setTotalCompras] = useState<number>(0);

  const fetchDatosDashboard = async () => {
    const datos = await getDatosDashboard();
    if (datos){
      setDatosEnvio(datos.DatosEnvio);
      setDatosVenta(datos.DatosVenta);
      setDatosCompra(datos.DatosCompra);
      setDatosCategoria(datos.DatosCategoria);
    }
  };

  useEffect(() => {
    fetchDatosDashboard()
  }, []);

  useEffect(() => {
    let total = 0
    DatosEnvio.map((datoEnvio)=> (total+=datoEnvio.totalEnvio+datoEnvio.venta.subTotal))
    setTotalEnvios(total)
  }, [DatosEnvio, TotalEnvios]);

  useEffect(() => {
    let total = 0
    DatosVenta.map((datoVenta)=> (total+=datoVenta.subTotal))
    setTotalVentas(total)
  }, [DatosVenta, TotalVentas]);

  useEffect(() => {
    let total = 0
    DatosCompra.map((datoCompra)=> (datoCompra.detalleCompra.map((detalleCompraUnica=> total+= detalleCompraUnica.total))))
    setTotalCompras(total)
  }, [DatosCompra, TotalCompras]);

  return (
    <>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-3 xl:grid-cols-3 2xl:gap-7.5">
        <DataCard name="Ventas" amount={TotalVentas} objetivo={(TotalVentas * 10) || 1}/>
        <DataCard name="Envio" amount={TotalEnvios} objetivo={(TotalEnvios * 10) || 1}/>
        <DataCard name="Compras" amount={TotalCompras} objetivo={(TotalCompras * 10) || 1} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7.5">
        <DataWave name="Ventas Mensuales" amount={12699} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7.5">
        <DataWave name="Envios mensuales" amount={12699} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 xl:grid-cols-1 2xl:gap-7.5">
        <DataWave name="Compras mensuales" amount={12699} />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <MapOne />
      </div>
    </>
  );
};

export default ECommerce;
