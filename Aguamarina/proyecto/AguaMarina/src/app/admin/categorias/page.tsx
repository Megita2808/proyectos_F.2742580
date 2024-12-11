"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataCategorias from "./dataCategorias";
import ChartThree from "@/components/Charts/ChartThree";
import BasicModal from "@/components/Modals/BasicModal";
import CrearCategoria from "./crearCategoriaForm";
import ButtonReload from "@/components/Buttons/ButtonReload";
import { useEffect, useState } from "react";



const TablesPage = () => {
  const [ reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    document.title = "Categorias";
  }, []);
  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };
  return (
    // <DefaultLayout>
    <div>
      <Breadcrumb pageName="Categorias" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
            <ButtonReload onClick={handleReload}/>
        </div>

        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-2">
          {/* Categoría Nueva */}
          <BasicModal tituloBtn="Categoría nueva" tituloModal="Categoría Nueva">
            <CrearCategoria />
          </BasicModal>
      </div>
      </div>

      <div className="flex flex-row gap-10">
        <CardTable data={<DataCategorias key={reloadKey} />} /* width={"75%"} *//>
        <div className="flex-grow flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
          <ChartThree />
        </div>
      </div>
      {/* </DefaultLayout> */}
    </div>
    
  );
};

export default TablesPage;
