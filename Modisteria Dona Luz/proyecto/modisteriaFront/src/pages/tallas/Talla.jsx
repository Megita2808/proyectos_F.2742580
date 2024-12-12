//mirando
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { toggleState } from "../../assets/constants.d";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Transition from "../../components/transition/Transition";
import { useForm } from "react-hook-form";
import useTallaData from "../../hooks/useTallaData";
import { toast, ToastContainer } from "react-toastify";
import { ColumnsTallas } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import SelectDash from "../../components/selectDash/SelectDash";
import {
  StraightenOutlined
} from "@mui/icons-material";
const Tallas = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const {
    initialFetchAllTallas,
    fetchAllTallas,
    deleteTalla,
    createTalla,
    updateTalla,
    loading,
  } = useTallaData();
  const {
    handleSubmit: handleSaveTalla,
    formState: { errors: errorsAddTalla },
    register: registerTalla,
    watch,
    reset,
  } = useForm();
  useEffect(() => {
    const initialFetchTallas = async () => {
      const respuesta = await initialFetchAllTallas();
      if (respuesta.status === 200 && respuesta.data) setData(respuesta.data);
    };
    initialFetchTallas();
  }, []);
  // Funciones para las modales
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({ nombre: row?.nombre || "", tipo: row?.tipo || "Alfanumérica" });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir talla");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar talla", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar talla", row);
  };

  const handleSave = async (data) => {
    let response;
    const dataParsed = { nombre: data.nombre.toUpperCase(), tipo: data.tipo };
    if (dialogProps.action === "add")
      response = await createTalla({ ...dataParsed, estadoId: 1 });
    if (dialogProps.action === "edit")
      response = await updateTalla(dialogProps.row.id, dataParsed);
    if (dialogProps.action === "delete")
      response = await deleteTalla(dialogProps.row.id);
    if (response.status !== 200 && response.status !== 201) return;
    const updatedData = await fetchAllTallas();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Talla ${
        dialogProps.action === "add"
          ? "agregada"
          : dialogProps.action === "edit"
          ? "editada"
          : "eliminada"
      } con éxito!`,
      {
        autoClose: 1800,
        toastId: "crudAction",
      }
    );
  };
  const columns = ColumnsTallas({ onEdit: handleEdit, onDelete: handleDelete });
  return (
    <>
      <Header
        title={"Tallas"}
        handleAdd={handleAdd}
        buttonText={"Agregar Talla"}
        icon={StraightenOutlined}
      ></Header>
      <br />
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
              height: '70vh',
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
        <form onSubmit={handleSaveTalla(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Estás seguro de que deseas eliminar la unidad de medida "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : (
              <div>
                <InputDash
                  description={
                    errorsAddTalla.nombre && errorsAddTalla.nombre.message
                  }
                  label="Nombre"
                  type="text"
                  {...registerTalla("nombre", {
                    required: "La talla necesita un nombre.",
                    maxLength: {
                      message: `¡La talla solo puede tener hasta ${
                        watch("tipo") === "Alfanumérica" ? 4 : 2
                      } caracteres!`,
                      value: watch("tipo") === "Alfanumérica" ? 4 : 2,
                    },
                    validate: {
                      isAlreadyRegistered: (value) => {
                        const dataToCheck =
                          dialogProps.action === "edit"
                            ? data.filter(
                                (talla) => talla.id != dialogProps.row.id
                              )
                            : data;
                        return (
                          !dataToCheck.some(
                            (talla) =>
                              talla.nombre.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          ) || "¡La talla ya se encuentra registrada!"
                        );
                      },
                      isNotNumberWhenNumericSelected: (value) => {
                        if (watch("tipo") === "Alfanumérica") return;
                        return (
                          /^\d+$/.test(value) ||
                          "Este tipo solo permite números"
                        );
                      },
                    },
                  })}
                ></InputDash>
                <SelectDash
                  {...registerTalla("tipo", {
                    required: "¡Debes escoger el tipo de talla!",
                  })}
                  description={
                    errorsAddTalla.tipo && errorsAddTalla.tipo.message
                  }
                  label={"Tipo Talla"}
                >
                  <option value="Alfanumérica">Alfanumérica</option>
                  <option value="Numérica">Numérica</option>
                </SelectDash>
              </div>
            )}
          </DialogContent>
          <CustomDialogActions
            cancelButton
            customCancelColor={dialogProps.action == "delete" && "inherit"}
            saveButton={dialogProps.action !== "delete"}
            deleteButton={dialogProps.action === "delete"}
            handleClose={() => toggleState(setOpenModal)}
          />
        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};
export default Tallas;
