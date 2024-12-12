import useProveedoresData from "../../hooks/useProveedoresData";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Transition from "../../components/transition/Transition";
import { useForm } from "react-hook-form";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import constants, { toggleState } from "../../assets/constants.d";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import { toast, ToastContainer } from "react-toastify";
import { ColumnsProveedores } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import { Business } from "@mui/icons-material";

const Proveedores = () => {
  const {
    handleSubmit: handleSaveCompra,
    formState: { errors: errorsAddCompra },
    register: registerProveedor,
    reset,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [data, setData] = useState([]);
  const {
    fetchAllProveedores,
    initialFetchAllProveedores,
    loading,
    createProveedores,
    updateProveedores,
    deleteProveedores,
  } = useProveedoresData();
  useEffect(() => {
    const initialFetchProveedores = async () => {
      const respuesta = await initialFetchAllProveedores();
      if (respuesta.status === 200) setData(respuesta.data);
    };
    initialFetchProveedores();
  }, []);
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({
      nombre: row?.nombre || "",
      telefono: row?.telefono || "",
      direccion: row?.direccion || "",
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Proveedor");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar Proveedor", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar Proveedor", row);
  };
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const respuesta = await updateProveedores(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllProveedores();
    setData(updatedData.data);
  };
  const handleSave = async (data) => {
    const { direccion, password, ...dataValid } = data;
    const finalData = {
      ...dataValid,
      ...(direccion !== "" && { direccion }),
    };
    let response;
    if (dialogProps.action === "add")
      response = await createProveedores({ ...finalData, estadoId: 1 });
    if (dialogProps.action === "edit")
      response = await updateProveedores(dialogProps.row.id, finalData);
    if (dialogProps.action === "delete") {
      if (dialogProps.row.estadoId === 1)
        return toast.error(
          "¡No se puede eliminar el proveedor porque está activo!",
          { autoClose: 1600, toastId: "activeError" }
        );
      response = await deleteProveedores(dialogProps.row.id);
    }
    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllProveedores();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Proveedor ${
        dialogProps.action === "add"
          ? "agregado"
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
  const columns = ColumnsProveedores({
    onEdit: handleEdit,
    onDelete: handleDelete,
    changeState: handleChangeState,
  });
  return (
    <>
      <Header
        title={"Proveedores"}
        handleAdd={handleAdd}
        buttonText={"Agregar proveedor"}
        icon={Business}
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
                sortModel: [{ field: "nombre", sort: "asc" }],
              },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </ContainerDataGrid>

      <Dialog
        open={openModal}
        keepMounted
        TransitionComponent={Transition}
        onClose={() => toggleState(setOpenModal)}
      >
        <form onSubmit={handleSaveCompra(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Deseas eliminar el proveedor "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : (
              <div>
                <InputDash
                  {...registerProveedor("nombre", {
                    required: "El proveedor necesita un nombre.",
                    minLength: {
                      message: "Mínimo requerido 4 caracteres",
                      value: 4,
                    },
                    maxLength: {
                      message: "Máximo permitido 25 caracteres",
                      value: 25,
                    },
                    validate: {
                      noNumbers: (value) =>
                        /^[^0-9]+$/.test(value) || "No se permiten números",
                      noSpecials: (value) =>
                        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(value) ||
                        "No se permiten caracteres especiales",
                      isAlreadyRegistered: (value) => {
                        const dataToCheck =
                          dialogProps.action === "edit"
                            ? data.filter(
                                (proveedor) =>
                                  proveedor.id != dialogProps.row.id
                              )
                            : data;
                        return (
                          !dataToCheck.some(
                            (proveedor) =>
                              proveedor.nombre.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          ) || "¡El proveedor ya se encuentra registrada!"
                        );
                      },
                    },
                  })}
                  label={"Nombre"}
                  type={"text"}
                  description={
                    errorsAddCompra.nombre && errorsAddCompra.nombre.message
                  }
                />
                <InputDash
                  {...registerProveedor("telefono", {
                    required: "El teléfono no puede estar vacío.",
                    minLength: {
                      message: "Ingresa un número colombiano valido (+57)",
                      value: 10,
                    },
                    maxLength: {
                      message: "Ingresa un número colombiano valido (+57)",
                      value: 10,
                    },
                    validate: {
                      isColombianNumber: (value) =>
                        constants.PHONE_REGEX.test(value) ||
                        "Ingresa un número colombiano valido (+57)",
                    },
                  })}
                  label={"Teléfono"}
                  type={"text"}
                  description={
                    errorsAddCompra.telefono && errorsAddCompra.telefono.message
                  }
                />
                <InputDash
                  {...registerProveedor("direccion", {
                    minLength: {
                      message:
                        "Mínimo 10 caracteres, ¡especifica más la dirección! (ej: Carrera 67a #37-103)",
                      value: 10,
                    },
                    maxLength: {
                      message: "Máximo permitido 100 caracteres",
                      value: 100,
                    },
                  })}
                  label={"Dirección"}
                  type={"text"}
                  description={
                    errorsAddCompra.direccion &&
                    errorsAddCompra.direccion.message
                  }
                />
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
      <ToastContainer></ToastContainer>
    </>
  );
};
export default Proveedores;
