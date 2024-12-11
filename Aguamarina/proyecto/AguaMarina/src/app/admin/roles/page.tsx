"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataRoles from "./dataRoles";
import BasicModal from "@/components/Modals/BasicModal";
import Loader from "@/components/common/Loader";
import ButtonReload from "@/components/Buttons/ButtonReload";
import CrearRolForm from "./crearRolForm";

const TablesPage = () => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Roles";
  }, []);

  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <Breadcrumb pageName="Lista de Roles" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
          <ButtonReload onClick={handleReload} />
        </div>
        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
           <BasicModal tituloBtn="Rol nuevo" tituloModal="Rol Nuevo">
            <CrearRolForm handleClose={handleReload}/>
          </BasicModal>
        </div>
      </div>
      
      <div className="flex flex-col gap-10">
        <CardTable data={<DataRoles key={reloadKey} />} />
      </div>
    </div>
  );
};

export default TablesPage;