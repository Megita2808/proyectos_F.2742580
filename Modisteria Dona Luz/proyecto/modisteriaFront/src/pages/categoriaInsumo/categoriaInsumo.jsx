import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Transition from "../../components/transition/Transition";
import { useForm } from "react-hook-form";
import SelectDash from "../../components/selectDash/SelectDash";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { toggleState } from "../../assets/constants.d";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import { toast, ToastContainer } from "react-toastify";
import { ColumnsCategoriaInsumos } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import useCategoriaDataInsumo from "../../hooks/useCategoriaDataInsumo";
import {
  Inventory2Outlined,
} from "@mui/icons-material";

const CategoriaInsumo = () => {
  const {
    fetchAllCategorias,
    loading,
    updateCategoria,
    createCategoria,
    deleteCategoria,
    initialFetchAllCategorias,
  } = useCategoriaDataInsumo();
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [data, setData] = useState([]);
  const {
    handleSubmit: handleSaveCategoria,
    formState: { errors: errorsAddCategoria },
    register: registerCategoria,
    reset,
  } = useForm();

  useEffect(() => {
    const initialFetchCategorias = async () => {
      const respuesta = await initialFetchAllCategorias();
      if (respuesta.status === 200) setData(respuesta.data);
    };
    initialFetchCategorias();
  }, []);
  // Funciones para las modales
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({
      nombre: row?.nombre || "",
      descripcion: row?.descripcion || "",
      tipo: row?.tipo || "Controlado",
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir categoría");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar categoría", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar categoría", row);
  };
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const respuesta = await updateCategoria(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllCategorias();
    setData(updatedData.data);
  };

  const handleSave = async (data) => {
    let response;
    if (dialogProps.action === "add")
      response = await createCategoria({ ...data, estadoId: 1 });
    if (dialogProps.action === "edit")
      response = await updateCategoria(dialogProps.row.id, data);
    if (dialogProps.action === "delete")
      response = await deleteCategoria(dialogProps.row.id);
    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllCategorias();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Categoría ${
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

  const columns = ColumnsCategoriaInsumos({
    onEdit: handleEdit,
    onDelete: handleDelete,
    changeState: handleChangeState,
  });
  return (
    <>
      <Header
        title={"Categorías insumos"}
        handleAdd={handleAdd}
        buttonText={"Agregar categoría"}
        icon={Inventory2Outlined}
      />
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
                sortModel: [{ field: "nombre", sort: "asc" }],
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
        <form onSubmit={handleSaveCategoria(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Estás seguro de que deseas eliminar la categoría "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : (
              <div>
                <InputDash
                  {...registerCategoria("nombre", {
                    required: "El nombre es requerido",
                    minLength: { value: 4, message: "¡Mínimo 4 caracteres!" },
                    maxLength: { value: 69, message: "¡Máximo 70 caracteres!" },
                    validate: {
                      isAlreadyRegistered: (value) => {
                        const dataToCheck =
                          dialogProps.action === "edit"
                            ? data.filter(
                                (categoria) =>
                                  categoria.id != dialogProps.row.id
                              )
                            : data;
                        return (
                          !dataToCheck.some(
                            (categoria) =>
                              categoria.nombre.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          ) || "¡La categoría ya se encuentra registrada!"
                        );
                      },
                    },
                  })}
                  label={"Nombre"}
                  type={"text"}
                  description={
                    errorsAddCategoria.nombre &&
                    errorsAddCategoria.nombre.message
                  }
                />
                <InputDash
                  {...registerCategoria("descripcion", {
                    minLength: { value: 4, message: "¡Mínimo 4 caracteres!" },
                    maxLength: {
                      value: 255,
                      message: "¡Máximo 255 caracteres!",
                    },
                  })}
                  label={"Descripción"}
                  type={"text"}
                  description={
                    errorsAddCategoria.descripcion &&
                    errorsAddCategoria.descripcion.message
                  }
                />
                <SelectDash
                  {...registerCategoria("tipo", {
                    required: "¡Debes escoger el tipo del insumo!",
                  })}
                  description={
                    errorsAddCategoria.tipo && errorsAddCategoria.tipo.message
                  }
                  label={"Tipo"}
                >
                  <option value={"Controlado"}>Controlado</option>
                  <option value={"No controlado"}>No controlado</option>
                </SelectDash>
              </div>
            )}
          </DialogContent>
          <CustomDialogActions
            cancelButton
            customCancelColor={dialogProps.action === "delete" && "inherit"}
            saveButton={dialogProps.action !== "delete"}
            deleteButton={dialogProps.action === "delete"}
            handleClose={() => toggleState(setOpenModal)}
          />
        </form>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default CategoriaInsumo;
