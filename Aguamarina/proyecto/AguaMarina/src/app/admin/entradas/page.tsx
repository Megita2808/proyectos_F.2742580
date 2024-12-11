"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataCompras from "./dataCompras";
import ButtonReload from "@/components/Buttons/ButtonReload";
import { useState, useEffect } from "react";

const TablesPage = () => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Entradas";
  }, []);

  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  }; 

  return (
    // <DefaultLayout>
      <div>
      <Breadcrumb pageName="Entradas" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
            <ButtonReload onClick={handleReload}/>
        </div>

        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
          {/* Espacio para algún Botón */}
      </div>
      </div>

      <div className="flex flex-col gap-10">
        
        <CardTable data={<DataCompras key={reloadKey}/>}/>
      </div>
      {/* </DefaultLayout> */}
      </div>
    
  );
};

export default TablesPage;
