//mirando
import React, { useState, useEffect } from "react";
import "./roles.css";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import PermissionList from "../../components/permisssionsList/PermissionList";
import InputDash from "../../components/inputDashboard/InputDash";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import Transition from "../../components/transition/Transition";
import { useForm } from "react-hook-form";
import useRolData from "../../hooks/useRolData";
import usePermisosData from "../../hooks/usePermisosData";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { toggleState } from "../../assets/constants.d";
import { ColumnsRoles } from "../../assets/columns";
import CheckboxCustom from "../../components/checkbox/CheckBoxCustom";
import {
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
const Roles = () => {
  const {
    handleSubmit: handleSaveRol,
    reset,
    formState: { errors: errorsAddRol },
    register: registerRol,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const [data, setData] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const {
    initialFetchAllroles,
    fetchAllroles,
    updaterol,
    createrol,
    deleterol,
    loading,
  } = useRolData();
  const { fetchAllPermisos, loading: loadingpermisos } = usePermisosData();
  useEffect(() => {
    const initialFetchRoles = async () => {
      const respuesta = await initialFetchAllroles();
      const permiso = await fetchAllPermisos();
      if (respuesta.status === 200 && permiso.status === 200) {
        setData(respuesta.data);
        setPermisos(permiso.data);
      }
    };
    initialFetchRoles();
  }, []);
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({
      nombre: row?.nombre || "",
      permisosId: row?.permisos || [],
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Rol");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar Rol", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar Rol", row);
  };
  const handlePermissions = (row) => {
    handleDialog("seePermissions", "Permisos", row);
  };
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const rol = data.find((rol) => rol.id === row.id);
    if (rol.usuarios.length > 0) {
      e.preventDefault();
      return toast.error("¡El rol ya está siendo usado!", {
        autoClose: 1500,
      });
    }
    const respuesta = await updaterol(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllroles();
    setData(updatedData.data);
  };
  const columns = ColumnsRoles({
    onEdit: handleEdit,
    onDelete: handleDelete,
    handlePermission: handlePermissions,
    changeState: handleChangeState,
  });
  const handleCheckboxChange = (permisoId) => {
    setSelectedPermisos((prevSelected) =>
      prevSelected.includes(permisoId)
        ? prevSelected.filter((id) => id !== permisoId)
        : [...prevSelected, permisoId]
    );
  };
  useEffect(() => {
    if (dialogProps.action === "edit" && dialogProps.row) {
      const permisosRol = dialogProps.row.permisos;
      setSelectedPermisos(permisosRol);
    } else {
      setSelectedPermisos([]);
    }
  }, [dialogProps]);
  const handleSave = async (data) => {
    const bodyData = {
      nombre: data.nombre,
      permisosId: selectedPermisos,
    };
    let response;
    if (dialogProps.action === "add")
      response = await createrol({ ...data, estadoId: 1 });
    if (dialogProps.action === "edit")
      response = await updaterol(dialogProps.row.id, data);
    if (dialogProps.action === "delete") {
      if (dialogProps.row.estadoId === 1)
        return toast.error("¡No se puede eliminar el rol porque está activo!", {
          autoClose: 1600,
          toastId: "activeError",
        });
      response = await deleterol(dialogProps.row.id);
    }
    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllroles();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Rol ${
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
  return (
    <>
      <Header
        title={"Roles"}
        handleAdd={handleAdd}
        buttonText={"Agregar Rol"}
        icon={AdminPanelSettingsOutlined}
      ></Header>
      <br />
      <ContainerDataGrid>
        {loading || loadingpermisos ? (
          <LoadingTableData></LoadingTableData>
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
        open={openModal}
        keepMounted
        TransitionComponent={Transition}
        onClose={() => toggleState(setOpenModal)}
      >
        <form onSubmit={handleSaveRol(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Deseas eliminar el rol "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : dialogProps.action === "seePermissions" ? (
              <PermissionList permisos={dialogProps.row.Permisos} />
            ) : (
              <div>
                <InputDash
                  {...registerRol("nombre", {
                    required: "El nombre es requerido",
                    minLength: { value: 4, message: "¡Mínimo 4 caracteres!" },
                    maxLength: { value: 69, message: "¡Máximo 70 caracteres!" },
                    validate: {
                      isAlreadyRegistered: (value) => {
                        const dataToCheck =
                          dialogProps.action === "edit"
                            ? data.filter((rol) => rol.id != dialogProps.row.id)
                            : data;
                        return (
                          !dataToCheck.some(
                            (rol) =>
                              rol.nombre.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          ) || "¡El rol ya se encuentra registrado!"
                        );
                      },
                    },
                  })}
                  label={"Nombre"}
                  type={"text"}
                  description={
                    errorsAddRol.nombre && errorsAddRol.nombre.message
                  }
                />
                <section>
                  <h2 className="tittleAñadir">Permisos</h2>
                  <hr />
                  <article className="permissions-grid">
                    {permisos.map((permiso) => {
                      return (
                        <CheckboxCustom
                          key={permiso.id}
                          {...registerRol(`permisosId`, {
                            required: "¡Debes elegir mínimo un permiso!",
                          })}
                          handlecheckbox={handleCheckboxChange}
                          permisoName={`${permiso.nombre}`}
                          checked={selectedPermisos.includes(permiso.id)}
                          idPermiso={permiso.id}
                        />
                      );
                    })}
                  </article>
                  <span className="errorPermisosId">
                    {errorsAddRol.permisosId && errorsAddRol.permisosId.message}
                  </span>
                </section>
              </div>
            )}
            {/* 
            <FormControl
              component="fieldset"
              sx={{
                marginTop: "20px",
              }}
            >
              <FormLabel sx={{ color: `${colors.grey[100]}!important` }}>
                Permisos
              </FormLabel>
              <FormGroup>
                <Grid
                  sx={{ marginLeft: "5px", marginTop: "10px" }}
                  container
                  spacing={2}
                >
                </Grid>
              </FormGroup>
              {errorsAddRol?.permisosId && (
                <FormHelperText sx={{ color: "red" }}>
                  {errorsAddRol.permisosId.message}
                </FormHelperText>
              )}
            </FormControl> */}
          </DialogContent>
          {dialogProps.action === "seePermissions" ? (
              <CustomDialogActions
                handleClose={() => toggleState(setOpenModal)}
                cancelButton
            />
          ): (
              <CustomDialogActions
                cancelButton
                customCancelColor={dialogProps.action === "delete" && "inherit"}
                saveButton={dialogProps.action !== "delete"}
                deleteButton={dialogProps.action === "delete"}
                handleClose={() => toggleState(setOpenModal)}
              />
          )}

        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Roles;
