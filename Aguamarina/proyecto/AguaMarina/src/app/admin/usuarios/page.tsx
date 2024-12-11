"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataUsuarios from "./dataUsuarios";
import ButtonReload from "@/components/Buttons/ButtonReload"; 
import CrearUsuario from "./crearUsuario";
import BasicModal from "@/components/Modals/BasicModal";


const TablesPage = () => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Lista de Usuarios";
  }, []);

  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };

  return (
    // <DefaultLayout>
      <div>
        <Breadcrumb pageName="Lista de usuarios" />

        <div className="flex flex-row justify-between">
          <div className="flex p-6 items-end">
            {/* Botón de recarga */}
            <ButtonReload onClick={handleReload} />
          </div>
        </div>

        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
          <BasicModal tituloBtn="Usuario Nuevo" tituloModal="Usuario Nuevo">
            <CrearUsuario/>
          </BasicModal>
        </div>

        <div className="flex flex-col gap-10">
          {/* Pasa el key reloadKey a DataUsuarios */}
          <CardTable data={<DataUsuarios key={reloadKey} />} />
        </div>
      </div>
    // </DefaultLayout>
  );
};

export default TablesPage;
