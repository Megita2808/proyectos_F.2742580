import Header from "../../components/Header/Header";
import { ColumnsUnidadesDeMedida } from "../../assets/columns";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import useUnidadesMedida from "../../hooks/useUnidadesMedida";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import "./unidadesMedida.css";
import Transition from "../../components/transition/Transition";
import InputDash from "../../components/inputDashboard/InputDash";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import { useEffect, useState } from "react";
import { toggleState } from "../../assets/constants.d";
import { useForm } from "react-hook-form";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { toast, ToastContainer } from "react-toastify";
import {
  HelpOutlineOutlined,
} from "@mui/icons-material";
export default function UnidadesMedida() {
  //Tenemos 3 useState, los datos, propiedades de la modal y abrir la modal.
  const [data, setData] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  //Un custom hook para las peticiones a la api
  const {
    initialFetchAllUnidades,
    fetchAllUnidades,
    updateUnidades,
    createUnidades,
    deleteUnidades,
    loading,
  } = useUnidadesMedida();
  //Tenemos un custom hook para validar formularios
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  // Un efecto al montar el componente
  useEffect(() => {
    const initialFetch = async () => {
      const response = await initialFetchAllUnidades();
      if (response.status === 200) setData(response.data);
    };
    initialFetch();
  }, []);

  // Funciones para las modales
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({ nombre: row?.nombre || "" });
    toggleState(setOpenAddModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir unidad de medida");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar unidad de medida", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar unida de medida", row);
  };

  //Función para acciones CRUD

  const handleSave = async (data) => {
    let response;
    if (dialogProps.action === "add") response = await createUnidades(data);
    if (dialogProps.action === "edit")
      response = await updateUnidades(dialogProps.row.id, data);
    if (dialogProps.action === "delete")
      response = await deleteUnidades(dialogProps.row.id);
    if (response.status !== 201 && response.status !== 200) return;
    const updatedData = await fetchAllUnidades();
    setData(updatedData.data);
    toggleState(setOpenAddModal);
    toast.success(
      `¡Unidad de medida ${
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
  // Columnas de la tabla
  const columns = ColumnsUnidadesDeMedida({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });
  return (
    <>
      <Header
        title="Unidades de medida"
        handleAdd={handleAdd}
        buttonText="Agregar unidad"
        icon={HelpOutlineOutlined}
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
            sx={{
              height: '70vh',
            }}
          />
        )}
      </ContainerDataGrid>
      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openAddModal}
        onClose={() => toggleState(setOpenAddModal)}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Estás seguro de que deseas eliminar la unidad de medida "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : (
              <InputDash
                {...register("nombre", {
                  required: "El nombre es requerido",
                  minLength: { value: 4, message: "¡Mínimo 4 caracteres!" },
                  maxLength: { value: 69, message: "¡Máximo 70 caracteres!" },
                  validate: {
                    isAlreadyRegistered: (value) => {
                      const dataToCheck =
                        dialogProps.action === "edit"
                          ? data.filter(
                              (unidad) => unidad.id != dialogProps.row.id
                            )
                          : data;
                      return (
                        !dataToCheck.some(
                          (unidad) =>
                            unidad.nombre.toLowerCase().trim() ===
                            value.toLowerCase().trim()
                        ) || "¡La unidad de medida ya se encuentra registrada!"
                      );
                    },
                  },
                })}
                label={"Nombre"}
                type={"text"}
                description={errors.nombre && errors.nombre.message}
              />
            )}
          </DialogContent>
          <CustomDialogActions
            cancelButton
            customCancelColor={dialogProps.action === "delete" && "inherit"}
            saveButton={dialogProps.action !== "delete"}
            deleteButton={dialogProps.action === "delete"}
            handleClose={() => toggleState(setOpenAddModal)}
          />
        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
}
