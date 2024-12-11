"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
import CrearProducto from "./crearProductoForm";
import AgregarProducto from "./agregarProductoForm";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataProductos from "./dataProductos";
import BasicModal from "@/components/Modals/BasicModal";
import Loader from "@/components/common/Loader";
import ButtonReload from "@/components/Buttons/ButtonReload";

const TablesPage = () => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Lista de Productos";
  }, []);

  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };
  
  return (
    // <DefaultLayout>
      <div>
      <Breadcrumb pageName="Lista de productos" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
          <ButtonReload onClick={handleReload}/>
        </div>
        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
          {/* Producto Nuevo */}
          <BasicModal tituloBtn="Producto nuevo" tituloModal="Producto nuevo" >
            <CrearProducto 
            handleClose={() => {}}/>
          </BasicModal>

          {/* Producto Existente */}
          <BasicModal tituloBtn="Producto existente" tituloModal="Producto existente"> 
            <AgregarProducto handleClose={() => {}}/>
          </BasicModal>

        </div>
      </div>
      <div className="flex flex-col gap-10">
        <CardTable data={<DataProductos key={reloadKey}/>}/>
      </div>
      </div>
    // </DefaultLayout>
  );
};

export default TablesPage;
