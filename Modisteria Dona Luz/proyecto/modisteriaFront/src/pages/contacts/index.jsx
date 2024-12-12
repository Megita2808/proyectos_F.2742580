import useUsuariosData from "../../hooks/useUsuarioData";
import { useJwt } from "../../context/JWTContext";
import userolesData from "../../hooks/useRolData";
import useDecodedJwt from "../../hooks/useJwt";
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
import { ColumnsUsuarios } from "../../assets/columns";
import InputDash from "../../components/inputDashboard/InputDash";
import SelectDash from "../../components/selectDash/SelectDash";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";

const Usuarios = () => {
  const {
    handleSubmit: handleSaveUsuario,
    formState: { errors: errorsAddUsuario },
    register: registerUsuario,
    reset,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  console.log(payload);

  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const {
    fetchAllUsuarios,
    initialFetchAllUsuarios,
    loading,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  } = useUsuariosData();
  const { initialFetchAllroles, loading: loadingRoles } = userolesData();
  useEffect(() => {
    const initialFetchUsuarios = async () => {
      const respuesta = await initialFetchAllUsuarios();
      const rolesRespuesta = await initialFetchAllroles();
      if (respuesta.status === 200 && rolesRespuesta.status === 200) {
        setData(respuesta.data);
        setRoles(rolesRespuesta.data);
      }
    };
    initialFetchUsuarios();
  }, []);

  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({
      nombre: row?.nombre || "",
      email: row?.email || "",
      telefono: row?.telefono || "",
      password: row?.password || "",
      direccion: row?.direccion || "",
      roleId: row?.roleId || roles[0]?.id,
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Usuario");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar Usuario", row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar Usuario", row);
  };
  const getRoleId = (roleId) => {
    const role = roles.find((rol) => rol.id === roleId);
    return role ? role.nombre : "Sin Rol asignado";
  };
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const respuesta = await updateUsuario(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllUsuarios();
    setData(updatedData.data);
  };
  const handleSave = async (data) => {
    const { direccion, password, ...dataValid } = data;
    const finalData = {
      ...dataValid,
      ...(direccion !== "" && { direccion }),
      ...(password !== "" && { password }),
    };
    let response;
    if (dialogProps.action === "add")
      response = await createUsuario({ ...finalData, estadoId: 1 });
    if (dialogProps.action === "edit")
      response = await updateUsuario(dialogProps.row.id, finalData);
    if (dialogProps.action === "delete") {
      if (dialogProps.row.estadoId === 1)
        return toast.error(
          "¡No se puede eliminar el usuario porque está activo!",
          { autoClose: 1600, toastId: "activeError" }
        );
      response = await deleteUsuario(dialogProps.row.id);
    }
    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllUsuarios();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Usuario ${
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
  const columns = ColumnsUsuarios({
    onEdit: handleEdit,
    onDelete: handleDelete,
    getRoleId: getRoleId,
    payload: payload,
    changeState: handleChangeState,
  });
  return (
    <>
      <Header
        title={"Usuarios"}
        handleAdd={handleAdd}
        buttonText={"Agregar usuario"}
        icon={ContactsOutlinedIcon}
      ></Header>
      <br />
      <ContainerDataGrid>
        {loading || loadingRoles ? (
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
        <form onSubmit={handleSaveUsuario(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent
            sx={{
              maxHeight: "400px",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Deseas eliminar el usuario con correo "${dialogProps.row.email}" ?`}</DialogContentText>
            ) : (
              <div>
                <InputDash
                  {...registerUsuario("nombre", {
                    required: "El usuario necesita un nombre.",
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
                    },
                  })}
                  label={"Nombre"}
                  type={"text"}
                  description={
                    errorsAddUsuario.nombre && errorsAddUsuario.nombre.message
                  }
                />
                <InputDash
                  {...registerUsuario("email", {
                    required: "Debes ingresar un correo",
                    pattern: {
                      value: constants.EMAIL_REGEX, // Expresión regular para números
                      message: "Ingresa un correo electrónico válido",
                    },
                    validate: {
                      isAlreadyRegistered: (value) => {
                        const dataToCheck =
                          dialogProps.action === "edit"
                            ? data.filter(
                                (user) => user.id != dialogProps.row.id
                              )
                            : data;
                        return (
                          !dataToCheck.some(
                            (user) =>
                              user.email.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          ) || "¡El usuario ya se encuentra registrado!"
                        );
                      },
                    },
                  })}
                  label={"Email"}
                  type={"email"}
                  description={
                    errorsAddUsuario.email && errorsAddUsuario.email.message
                  }
                />
                <InputDash
                  {...registerUsuario("telefono", {
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
                    errorsAddUsuario.telefono &&
                    errorsAddUsuario.telefono.message
                  }
                />
                {dialogProps.action === "add" && (
                  <InputDash
                    {...registerUsuario("password", {
                      required: "La contraseña es obligatoria.",
                      minLength: {
                        message: "Mínimo requerido 8 caracteres",
                        value: 8,
                      },
                      maxLength: {
                        message: "Máximo permitido 30 caracteres",
                        value: 30,
                      },
                    })}
                    label={"Contraseña"}
                    type={"password"}
                    description={
                      errorsAddUsuario.password &&
                      errorsAddUsuario.password.message
                    }
                  />
                )}
                <InputDash
                  {...registerUsuario("direccion", {
                    minLength: {
                      message:
                        "Mínimo 10 caracteres, ¡especifica más la dirección! (ej: Carrera 67a #37-103)",
                      value: 10,
                    },
                    maxLength: {
                      message: "Máximo permitido 50 caracteres",
                      value: 50,
                    },
                  })}
                  label={"Dirección"}
                  type={"text"}
                  description={
                    errorsAddUsuario.direccion &&
                    errorsAddUsuario.direccion.message
                  }
                />{" "}
                <SelectDash
                  {...registerUsuario("roleId", {
                    required: "Debes escoger un rol!",
                  })}
                  label="Rol"
                  description={
                    errorsAddUsuario.roleId && errorsAddUsuario.roleId.message
                  }
                >
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
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
      <ToastContainer></ToastContainer>
    </>
  );
};
export default Usuarios;
