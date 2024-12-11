"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {useRouter} from 'next/navigation';
import CardTable from "@/components/Tables/CardTable";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataReservas from "./dataReservas";
import CrearReserva from "./crearReserva";
import BasicModal from "@/components/Modals/BasicModal";
import Loader from "@/components/common/Loader";
import ButtonReload from "@/components/Buttons/ButtonReload";
import ButtonOnClick from "@/components/Buttons/ButtonOnClick";
import ModalSinBoton from "@/components/Modals/ModalSinBoton";
import Swal from "sweetalert2";


const TablesPage = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Lista de Reservas";
  }, []);

  const handleReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <Breadcrumb pageName="Lista de reservas" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
          <ButtonReload onClick={handleReload} />
        </div>
        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
        <ButtonOnClick
          label={"Nueva Reserva"}
          customClasses=" text-xl font-semibold border border-primary hover:bg-primary hover:text-white text-primary rounded-[5px] px-10 py-3 lg:px-8 xl:px-10"
          onClick={async() => {
            
            const result = await Swal.fire({
              icon: "question",
              iconColor: "#000",
              color: "#000",
              title: `<strong>¿Para quién es la Reserva?</strong>`,
              showCancelButton: true,
              cancelButtonText: "Cliente Nuevo",
              cancelButtonColor: "#000",
              confirmButtonColor: "#6A0DAD",
              reverseButtons: true,
              showConfirmButton: true,
              confirmButtonText: "Cliente Existente",
              background: "url(/images/grids/bg-morado-bordes.avif) no-repeat center center/cover",
              customClass: {
                popup: "rounded-3xl shadow shadow-6",
                container: "custom-background",
                cancelButton: "rounded-xl",
                confirmButton: "rounded-xl",
              },
            }).then((res) => {
              if (res.isConfirmed) {
                setOpen(true);
              }
              else if (res.dismiss === Swal.DismissReason.cancel) {
                router.push('/admin/usuarios');
              }
            });
          
          }}
        >
        </ButtonOnClick>
        <ModalSinBoton
          setOpen={setOpen}
          open={open}
          handleClose={() => {}}
          tituloModal="Nueva Reserva"
        >
          <CrearReserva handleClose={() => {}}/>
        </ModalSinBoton>

        {/* <BasicModal tituloBtn="Generar reserva" tituloModal="Nueva reserva">
            <CrearReserva handleClose={() => {}}/>
          </BasicModal> */}
        </div>
      </div>
      
      <div className="flex flex-col gap-10">
        <CardTable data={<DataReservas key={reloadKey} />} />
      </div>
    </div>
  );
};

export default TablesPage;
