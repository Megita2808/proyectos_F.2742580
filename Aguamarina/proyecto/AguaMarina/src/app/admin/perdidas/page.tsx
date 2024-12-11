"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataPerdidas from "./dataPerdidas";
import BasicModal from "@/components/Modals/BasicModal";
import Loader from "@/components/common/Loader";
import ButtonReload from "@/components/Buttons/ButtonReload";
import CrearPerdida from "./crearPerdidaForm";

const TablesPage = () => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Perdidas";
  }, []);

  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <Breadcrumb pageName="Lista de perdidas" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
          <ButtonReload onClick={handleReload} />
        </div>
        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
          {/* Producto Nuevo */}
          {/* <BasicModal tituloBtn="Agregar perdida" tituloModal="Perdida nueva">
            <CrearPerdida handleClose={() => {}} />
          </BasicModal> */}

        </div>
      </div>
      
      <div className="flex flex-col gap-10">
        <CardTable data={<DataPerdidas key={reloadKey} />} />
      </div>
    </div>
  );
};

export default TablesPage;
