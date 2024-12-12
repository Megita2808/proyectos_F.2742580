import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, DialogContentText } from "@mui/material";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Transition from "../../components/transition/Transition";
import { useForm } from "react-hook-form";
import useCategoriaData from "../../hooks/useCategoriaData";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { toggleState } from "../../assets/constants.d";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import { toast, ToastContainer } from "react-toastify";
import { ColumnsCategoriaPrendas } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import {
  StyleOutlined
} from "@mui/icons-material";
import "./categoriaPrenda.css";

const CategoriaPrenda = () => {
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [data, setData] = useState([]);

  const {
    fetchAllCategorias,
    loading,
    updateCategoria,
    createCategoria,
    deleteCategoria,
    initialFetchAllCategorias
  } = useCategoriaData();

  const {
    handleSubmit: handleSaveCategoria,
    formState: { errors: errorsAddCategoria },
    register: registerCategoria,
    reset,
  } = useForm();

  

  useEffect(() => {
    const initialFetchCategorias = async () => {
      const respuesta = await initialFetchAllCategorias();
      if (respuesta.status === 200) {
        console.log(respuesta.data); // Verifica si el campo 'molde' está presente y tiene valores
        setData(respuesta.data);
      }
    };
    initialFetchCategorias();
  }, []);
  
  // Funciones para las modales
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({ nombre: row?.nombre || "", descripcion: row?.descripcion || "", molde: row?.molde || "" });
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
  const handleDownload = (row) => {
    if (!row.molde) {
      toast.error("Molde no disponible");
      return;
    }
    window.open(row.molde, "_blank");
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

  const handleSave = async (formData) => {
    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.nombre);
    dataToSend.append("descripcion", formData.descripcion);
    if (formData.molde && formData.molde[0]) {
      dataToSend.append("molde", formData.molde[0]);
    }

    console.log([...dataToSend.entries()]); // Imprime los campos que estás enviando
    let response;
    if (dialogProps.action === "add")
      response = await createCategoria(dataToSend);
    if (dialogProps.action === "edit")
      response = await updateCategoria(dialogProps.row.id, dataToSend);
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
      `¡Categoría ${dialogProps.action === "add"
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

  const columns = ColumnsCategoriaPrendas({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onDownload: handleDownload,
    changeState: handleChangeState,
  });
  return (
    <>
      <Header
        title={"Categorías prenda"}
        handleAdd={handleAdd}
        buttonText={"Agregar categoría"}
        icon={StyleOutlined}
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
                  })}
                  label={"Nombre"}
                  type={"text"}
                  description={
                    errorsAddCategoria.nombre && errorsAddCategoria.nombre.message
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
                <br />
                {/* Nuevo campo para el archivo PDF */}
                <center>
                  <label for="file" className="custum-file-upload">
                    <div className="icon">
                      <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                    </div>
                    <div className="textImge">
                      <span>Click para subir PDF</span>
                    </div>
                      <input 
                        id="file" 
                        type="file"
                        accept="application/pdf"
                        {...registerCategoria("molde", {
                          required: dialogProps.action === "add" && "El archivo es requerido",
                        })}
                      />
                    {errorsAddCategoria.molde && (
                      <span>{errorsAddCategoria.molde.message}</span>
                    )}
                  </label>
                </center>
              </div>

            )
            }
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

export default CategoriaPrenda;