//mirando
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import "./insumoDashboard.css";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import Transition from "../../components/transition/Transition";
import useInsumosData from "../../hooks/useInsumosData";
import useCategoriaDataInsumo from "../../hooks/useCategoriaDataInsumo";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../components/Header/Header";
import { AddRounded } from "../../components/svg/Svg.jsx";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import useUnidadesMedida from "../../hooks/useUnidadesMedida.js";
import { toggleState } from "../../assets/constants.d";
import { ColumnsInsumos } from "../../assets/columns";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import SelectDash from "../../components/selectDash/SelectDash";
import InputDash from "../../components/inputDashboard/InputDash";
import { useJwt } from "../../context/JWTContext";
import useDecodedJwt from "../../hooks/useJwt";
import { InventoryOutlined } from "@mui/icons-material";
const Insumos = () => {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const {
    handleSubmit: handleSaveInsumo,
    formState: { errors: errorsAddInsumo },
    register: registerInsumo,
    reset,
  } = useForm();
  const {
    handleSubmit: handleSaveControlInsumos,
    register: registerControlInsumo,
    watch: watchControlInsumo,
    getValues,
    setValue,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [controlInsumos, setControlInsumos] = useState([]);
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  console.log(data);

  const insumoToAdd = useRef();
  const {
    initialFetchAllInsumos,
    fetchAllInsumos,
    deleteInsumo,
    createInsumo,
    updateInsumos,
    updateCantidadInsumos,
    loading,
  } = useInsumosData();
  const { initialFetchAllCategorias, loading: loadingCategoria } =
    useCategoriaDataInsumo();
  const { initialFetchAllUnidades, loading: loadingUnidades } =
    useUnidadesMedida();
  useEffect(() => {
    const initialFetchInsumos = async () => {
      const respuesta = await initialFetchAllInsumos();
      const categoria = await initialFetchAllCategorias();
      const unidades = await initialFetchAllUnidades();
      if (
        respuesta.status === 200 &&
        categoria.status === 200 &&
        unidades.status === 200
      ) {
        setData(respuesta.data);
        setCategorias(categoria.data.filter((cat) => cat.estadoId === 1));
        setUnidades(unidades.data);
      }
    };
    initialFetchInsumos();
  }, []);
  const changeInsumoQuantity = (idx, action) => {
    const cantidadACambiar = parseFloat(getValues("cantidadInsumo")[idx]);
    if (cantidadACambiar <= 1 && action === "substract") return;
    setValue(
      `cantidadInsumo[${idx}]`,
      action === "substract" ? cantidadACambiar - 1 : cantidadACambiar + 1
    );
  };

  const addInsumo = () => {
    if (!insumoToAdd.current.value)
      return toast.error("¡Debes seleccionar un insumo!", {
        toastId: "addInsumoError",
        autoClose: 1500,
      });
    if (controlInsumos.some((insumo) => insumo.id == insumoToAdd.current.value))
      return toast.error("¡Ya has añadido el insumo!", {
        toastId: "addInsumoErrorAlreadyAdded",
        autoClose: 1500,
      });
    const insumo = data.find(
      (insumo) => insumo.id == insumoToAdd.current.value
    );
    setControlInsumos((prev) => prev.concat(insumo));
  };

  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    reset({
      nombre: row?.nombre || "",
      cantidad: row?.cantidad || "",
      categoriaInsumoId: row?.categoriaInsumoId || categorias[0]?.id,
      unidadMedidaId: row?.unidadMedidaId || unidades[0]?.id,
    });
    toggleState(setOpenModal);
  };
  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin Categoría";
  };
  const getUnidadMedida = (unidadId) => {
    const unidad = unidades.find((unidades) => unidades.id === unidadId);
    return unidad ? unidad.nombre : "Sin unidad de medida";
  };
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const respuesta = await updateInsumos(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllInsumos();
    setData(updatedData.data);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Insumo");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar Insumo", row);
    console.log(row);
  };
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar Insumo", row);
  };
  const handleRestock = () => {
    handleDialog("restock", "Restar Insumos no Controlados");
  };
  const saveControlInsumos = async (data) => {
    const insumos = [];
    data.cantidadInsumo.forEach((cantidad, idx) => {
      insumos.push({
        id: controlInsumos[idx].id,
        cantidad: parseFloat(cantidad) * -1,
        motivo: data.motivo[idx],
      });
    });
    const respuesta = await updateCantidadInsumos({
      insumos,
      usuario_id: payload?.id,
    });
    if (respuesta.status != 201)
      return toast.error(respuesta.data.errors[0], {
        autoClose: 2500,
        toastId: "errorSubstractInsumos",
        style: { color: "black" },
      });
    const updatedData = await fetchAllInsumos();
    if (updatedData.status === 200 && updatedData.data) {
      setData(updatedData.data);
      setControlInsumos([]);
      toggleState(setOpenModal);
      toast.success("¡Insumos restados exitosamente!", {
        autoClose: 2000,
        toastId: "restock-successfully",
      });
    }
  };
  const handleSave = async (data) => {
    let response;
    if (dialogProps.action === "add")
      response = await createInsumo({ ...data, estadoId: 1 });
    if (dialogProps.action === "edit")
      response = await updateInsumos(dialogProps.row.id, data);
    if (dialogProps.action === "delete") {
      if (dialogProps.row.estadoId === 1)
        return toast.error(
          "¡No se puede eliminar el insumo porque está activo!",
          { autoClose: 1600, toastId: "activeError" }
        );
      response = await deleteInsumo(dialogProps.row.id);
    }
    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllInsumos();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Insumo ${
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
  const columns = ColumnsInsumos({
    onDelete: handleDelete,
    onEdit: handleEdit,
    changeState: handleChangeState,
    getCategoriaNombre: getCategoriaNombre,
    getUnidadMedida,
  });
  return (
    <>
      <Header
        title={"Insumos"}
        handleAdd={handleAdd}
        secondButton={data.length >= 1}
        secondButtonText={"Restar insumos"}
        handleSecondButtonFunction={handleRestock}
        buttonText={"Añadir Insumo"}
        icon={InventoryOutlined}
      ></Header>
      <br />
      <ContainerDataGrid>
        {loading || loadingCategoria || loadingUnidades ? (
          <LoadingTableData />
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "cantidad", sort: "desc" }],
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
        <form
          onSubmit={
            dialogProps.action === "restock"
              ? handleSaveControlInsumos(saveControlInsumos)
              : handleSaveInsumo(handleSave)
          }
        >
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText>{`¿Estás seguro de que deseas eliminar el insumo "${dialogProps.row.nombre}" ?`}</DialogContentText>
            ) : dialogProps.action === "restock" ? (
              <div>
                <div className="add-insumo-header">
                  <SelectDash
                    width={"400px"}
                    label="Seleccionar insumo"
                    ref={insumoToAdd}
                  >
                    {data
                      .filter(
                        (wildInsumo) =>
                          wildInsumo.categoria_insumos.tipo === "No controlado"
                      )
                      .map((insumo) => (
                        <option key={insumo.id} value={insumo.id}>
                          {insumo.nombre}
                        </option>
                      ))}
                  </SelectDash>
                  <Button sx={{ mt: "20px" }} onClick={addInsumo}>
                    <AddRounded size={24} color={"#fff"}></AddRounded>
                  </Button>
                </div>
                <div>
                  <div
                    style={{ display: controlInsumos.length ? "grid" : "none" }}
                    className="titles-insumos"
                  >
                    <div>
                      <h4>Insumo</h4>
                    </div>
                    <div>
                      <h4>{`Cantidad a Restar`}</h4>
                    </div>
                  </div>
                  {controlInsumos &&
                    controlInsumos.map((insumo, idx) => (
                      <div key={insumo.id} style={{ marginTop: "6px" }}>
                        <div className="body-insumos">
                          <div>
                            <h4>{`${insumo.nombre} (Cantidad en: ${insumo.unidades_de_medida.nombre})`}</h4>
                          </div>
                          <div className="acciones">
                            <span
                              style={{ marginRight: "10px" }}
                              onClick={() =>
                                changeInsumoQuantity(idx, "substract")
                              }
                              className="quantity-button no-select"
                            >
                              -
                            </span>
                            <InputDash
                              {...registerControlInsumo(
                                `cantidadInsumo[${idx}]`,
                                {
                                  required: `La cantidad de "${insumo.nombre}" es requerida`,

                                  onChange: (e) => {
                                    let { value } = e.target;
                                    const regex = /^-?\d+(\.\d*)?$/;
                                    if (!regex.test(value)) {
                                      value = value.replace(/[^0-9.-]/g, "");
                                      if (
                                        value.includes(".") &&
                                        !/\d+\./.test(value)
                                      ) {
                                        value = value.replace(".", "");
                                      }
                                    }

                                    e.target.value = value;
                                  },
                                }
                              )}
                              width="85px"
                              initialValue={1}
                            />
                            <span
                              onClick={() => changeInsumoQuantity(idx, "add")}
                              className="no-select quantity-button"
                            >
                              +
                            </span>
                          </div>
                        </div>
                        <InputDash
                          {...registerControlInsumo(`motivo[${idx}]`, {
                            required: `La justificación de "${insumo.nombre}" es requerida`,
                          })}
                          label={`Motivo para disminuir "${insumo.nombre}"`}
                          type="text"
                        />
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div>
                <InputDash
                  {...registerInsumo("nombre", {
                    required: "El insumo necesita un nombre.",
                    minLength: {
                      message:
                        "¡El insumo debe tener por lo menos 4 caracteres!",
                      value: 4,
                    },
                    maxLength: {
                      message: "¡El insumo debe tener máximo 70 caracteres!",
                      value: 69,
                    },
                    validate: {
                      isAlreadyRegistered: (value) => {
                        const dataToCheck =
                          dialogProps.action === "edit"
                            ? data.filter(
                                (insumo) => insumo.id != dialogProps.row.id
                              )
                            : data;
                        return (
                          !dataToCheck.some(
                            (insumo) =>
                              insumo.nombre.toLowerCase().trim() ===
                              value.toLowerCase().trim()
                          ) || "¡El insumo ya se encuentra registrado!"
                        );
                      },
                    },
                  })}
                  label="Nombre"
                  type="text"
                  description={
                    errorsAddInsumo.nombre && errorsAddInsumo.nombre.message
                  }
                />
                {dialogProps.action === "add" && (
                  <InputDash
                    {...registerInsumo("cantidad", {
                      required: "La cantidad es requerida",
                      pattern: {
                        value: /^\d+(.\d+)?$/, // Expresión regular para números
                        message: "Solo se permiten números",
                      },
                      min: {
                        message:
                          "¡Debes ingresar una cantidad igual mayor a cero!",
                        value: 0,
                      },
                      max: { message: "¡Límite máximo de 250!", value: 300 },
                    })}
                    label="Cantidad"
                    type="text"
                    description={
                      errorsAddInsumo.cantidad &&
                      errorsAddInsumo.cantidad.message
                    }
                  />
                )}

                <SelectDash
                  {...registerInsumo("unidadMedidaId", {
                    required: "Debes escoger una unidad de medida!",
                  })}
                  description={
                    errorsAddInsumo.unidadMedidaId &&
                    errorsAddInsumo.unidadMedidaId.message
                  }
                  label="Unidad de medida"
                >
                  {unidades.map((unidad) => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.nombre}
                    </option>
                  ))}
                </SelectDash>
                <SelectDash
                  {...registerInsumo("categoriaInsumoId", {
                    required: "Debes escoger una categoría!",
                  })}
                  description={
                    errorsAddInsumo.categoriaInsumoId &&
                    errorsAddInsumo.categoriaInsumoId.message
                  }
                  label="Categorías"
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {`${cat.nombre} (${cat.tipo})`}
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
export default Insumos;
