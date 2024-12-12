import "./domicilio.css";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import useDomicilioData from "../../hooks/useDomicilioInfo";
import { estadosDomicilio, toggleState } from "../../assets/constants.d";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import { ColumnsDomicilios } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import Transition from "../../components/transition/Transition";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { useForm } from "react-hook-form";

export default function Domicilio() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { initialFetchAllDomicilios, fetchAllDomicilios, loading, updateSG } =
    useDomicilioData();
  useEffect(() => {
    const initialFetchDomicilios = async () => {
      const respuesta = await initialFetchAllDomicilios();
      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data);
      }
    };
    initialFetchDomicilios();
  }, []);
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({ guia: "" });
    toggleState(setOpenModal);
  };
  const handleInfo = () => {
    handleDialog("info", "Información estados");
  };
  const handleDetails = (row) => {
    handleDialog("details", "Detalle Domicilio", row);
  };
  const handleConfirm = (row) => {
    handleDialog("confirm", "Confirmar Domicilio", row);
  };
  const handleSave = async (data) => {
    let response;
    const bodyConfirm = {
      guia: data.guia,
      estadoId: 15,
    };
    response = await updateSG(dialogProps.row.id, bodyConfirm);
    const updatedData = await fetchAllDomicilios();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Domicilio ${
        dialogProps.action === "confirm"
          ? "Entregado a agencia"
          : dialogProps.action === "edit"
          ? "editado"
          : "eliminado"
      } con éxito!`,
      {
        autoClose: 1800,
        toastId: "crudAction",
      }
    );
  };
  const columns = ColumnsDomicilios({ handleDetails, handleConfirm });
  return (
    <>
      <Header
        title={"Domicilios"}
        handleAdd={handleInfo}
        buttonText={"Ver estdos"}
      />
      <ContainerDataGrid>
        {loading ? (
          <LoadingTableData />
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "tipo", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              height: "70vh",
            }}
          />
        )}
      </ContainerDataGrid>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={() => toggleState(setOpenModal)}
      >
        <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
            {dialogProps.action === "info" && (
              <section className="info-section">
                {estadosDomicilio.map((estado, idx) => (
                  <div key={idx}>
                    <article>
                      <span
                        style={{ background: estado.color }}
                        className="color-estado"
                      ></span>
                      <span>{estado.nombre}</span>
                    </article>
                    <p>{estado.descripcion}</p>
                  </div>
                ))}
              </section>
            )}
            {dialogProps.action === "confirm" && (
              <div>
                <InputDash
                  {...register("guia", {
                    required:
                      "¡La guía es requerida para confirmar el domicilio!",
                    minLength: {
                      message: "¡La guía debe tener mínimo 4 caracteres!",
                      value: 4,
                    },
                    maxLength: {
                      message: "¡Máximo permitido 255 caracteres!",
                      value: 255,
                    },
                  })}
                  type="text"
                  label="Guía servicio correspondencia"
                  description={errors.guia && errors.guia.message}
                />
              </div>
            )}
          </DialogContent>
          <CustomDialogActions
            cancelButton
            saveButton={dialogProps.action !== "info"}
            handleClose={() => toggleState(setOpenModal)}
          />
        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
}
