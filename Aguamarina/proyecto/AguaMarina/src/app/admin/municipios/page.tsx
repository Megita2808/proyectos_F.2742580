"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataMunicipios from "./dataMunicipios";
import ChartThree from "@/components/Charts/ChartThree";
import BasicModal from "@/components/Modals/BasicModal";
import CrearMunicipio from "./crearMunicipioForm";
import ButtonReload from "@/components/Buttons/ButtonReload";
import { useEffect, useState } from "react";
import ReservationsByCity from "@/components/Charts/ReservationsByCity";



const TablesPage = () => {
  const [ reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    document.title = "Municipios";
  }, []);
  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };
  return (
    // <DefaultLayout>
    <div>
      <Breadcrumb pageName="Municipios" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
            <ButtonReload onClick={handleReload}/>
        </div>

        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
          {/* Categoría Nueva */}
          <BasicModal tituloBtn="Municipio nuevo" tituloModal="Municipio Nuevo">
            <CrearMunicipio />
          </BasicModal>
      </div>
      </div>

      <div className="flex flex-row gap-10">
        <CardTable data={<DataMunicipios key={reloadKey} />} customClasses="!w-[75%]"/>
        <div >
          <ReservationsByCity />
        </div>
      </div>
      {/* </DefaultLayout> */}
    </div>
    
  );
};

export default TablesPage;
