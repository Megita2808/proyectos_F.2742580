import "./compras.css";
import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import Transition from "../../components/transition/Transition";
import useComprasData from "../../hooks/useCompraData";
import useProveedoresData from "../../hooks/useProveedoresData.js";
import { toast, ToastContainer } from "react-toastify";
import Header from "../../components/Header/Header";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import useInsumosData from "../../hooks/useInsumosData.js";
import { formToCop, toggleState } from "../../assets/constants.d";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import SelectDash from "../../components/selectDash/SelectDash";
import InputDash from "../../components/inputDashboard/InputDash";
import CardCompras from "../../components/cardCompras/CardCompras.jsx";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useIsFirstRender from "../../hooks/useIsMount.js";
import { Paid } from "@mui/icons-material";
import { AddRounded } from "../../components/svg/Svg.jsx";
import { useNavigate } from "react-router-dom";
import { da } from "date-fns/locale";
const Compras = () => {
  const {
    handleSubmit: handleSaveCompra,
    formState: { errors: errorsAddCompra },
    register: registerCompra,
    reset,
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  const { initialFetchAllInsumos, loading: loadingInsumos } = useInsumosData();
  const { initialFetchAllProveedores, loading: loadingProveedor } =
    useProveedoresData();
  const { initialFetchAllCompras, fetchAllCompras, createCompra, loading } =
    useComprasData();
  useEffect(() => {
    const initialFetchCompras = async () => {
      const respuesta = await initialFetchAllCompras();
      const insumos = await initialFetchAllInsumos();
      const proveedores = await initialFetchAllProveedores();
      if (
        respuesta.status === 200 &&
        insumos.status === 200 &&
        proveedores.status === 200
      ) {
        setData(respuesta.data);
        console.log(respuesta.data);

        setInsumos(insumos.data.filter((insumo) => insumo.estadoId === 1));
        setProveedores(
          proveedores.data.filter((proveedor) => proveedor.estadoId === 1)
        );
      }
    };
    initialFetchCompras();
  }, []);
  const handleDialog = (action, title) => {
    setDialogProps({ action, title });
    reset({
      valorTotal: "",
      cantidad: "",
      proveedorId: proveedores[0]?.id,
      insumoId: insumos[0]?.id,
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Compra");
  };
  const getUnidadMedida = (insumoId) => {
    const insumo = insumos.find((insumo) => insumo.id == insumoId);
    return insumo && insumo.unidades_de_medida.nombre.toLowerCase();
  };
  const handleSave = async (data) => {
    let compras = [];
    numberOfInsumos.forEach((_, idx) => {
      compras.push({
        cantidad: parseFloat(data.cantidad[idx]),
        valor: parseInt(data.valorTotal[idx]),
        insumoId: parseInt(data.insumoId[idx]),
        proveedorId: data.proveedorId,
      });
    });
    const response = await createCompra({
      compras: compras,
    });
    if (response.status !== 201 && response.status !== 200)
      return toast.error(response.data.message, {
        autoClose: 2000,
        toastId: "error",
      });
    const updatedData = await fetchAllCompras();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(`¡Compra agregada con éxito!`, {
      autoClose: 1800,
      toastId: "crudAction",
    });
  };
  const handleAddInsumo = () => {
    if (numberOfInsumos.length >= insumos?.length)
      return toast.error("¡Ya has agregado todos tus insumos!", {
        toastId: "errorAllInsumos",
        autoClose: 1500,
      });
    setNumberOfInsumos((prev) => (!prev ? [1] : [...prev, prev.length + 1]));
    setValue(
      `insumoId[${numberOfInsumos.length}]`,
      insumos[numberOfInsumos.length]?.id
    );
  };
  const [lastModifications, setLastModifications] = useState(true);
  const isFirstRender = useIsFirstRender();
  const [filteredData, setFilteredData] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  const [numberOfInsumos, setNumberOfInsumos] = useState([]);
  const [inputDateFilter, setInputDateFilter] = useState();
  const handleFilterDataDates = () => setLastModifications(!lastModifications);
  const handleSpecificDate = (e) => setInputDateFilter(e.target.value);
  useEffect(() => {
    if (isFirstRender) return;
    const initialComprasData = inputDateFilter
      ? data.filter((compra) => compra.fecha.includes(inputDateFilter))
      : data;
    if (lastModifications) {
      setFilteredData(initialComprasData);
    } else {
      const sortedData = [...initialComprasData].sort((a, b) => a.id - b.id);
      setFilteredData(sortedData);
    }
  }, [lastModifications, data, inputDateFilter]);
  return (
    <>
      <Header
        icon={Paid}
        title={"Compras"}
        handleAdd={handleAdd}
        buttonText={"Añadir compra"}
      ></Header>

      <div className="filtrosControl">
        <div className="header-actions">
          <Button
            variant="contained"
            onClick={handleFilterDataDates}
            color="primary"
            startIcon={<FilterListIcon />}
            endIcon={
              lastModifications ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon></ArrowDownwardIcon>
              )
            }
          >
            {lastModifications ? "Recientes" : "Viejas"}
          </Button>
        </div>

        <div className="textInputWrapper">
          <input
            value={inputDateFilter}
            onChange={handleSpecificDate}
            type="date"
            className="textInput"
          />
        </div>
      </div>
      <div>
        {loading || loadingInsumos || loadingProveedor ? (
          <LoadingTableData />
        ) : filteredData.length ? (
          <section className="compras-main">
            {filteredData.map((compra) => (
              <CardCompras key={compra.id} compra={compra} />
            ))}
          </section>
        ) : (
          <div className="sin-compras">¡Sin compras registradas!</div>
        )}
      </div>
      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={() => toggleState(setOpenModal)}
      >
        <form onSubmit={handleSaveCompra(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            <SelectDash
              {...registerCompra("proveedorId", {
                required: "¡Debes escoger un proveedor!",
              })}
              description={
                errorsAddCompra.proveedorId &&
                errorsAddCompra.proveedorId.message
              }
              label="Proveedor"
            >
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </SelectDash>
            {insumos.length >= 1 ? (
              <section className="add-insumo">
                <span>Añadir El insumo Asociado</span>
                <Button onClick={handleAddInsumo}>
                  <AddRounded size={24} color={"#fff"}></AddRounded>
                </Button>
              </section>
            ) : (
              <div
                onClick={() => {
                  navigate("/dashboard/insumo");
                }}
                className="no-insumo"
              >
                ¡No tienes insumos activos! <span>Ir a insumos</span>
              </div>
            )}
            {numberOfInsumos.length > 0 &&
              numberOfInsumos.map((_, idx) => (
                <div key={idx}>
                  <SelectDash
                    {...registerCompra(`insumoId[${idx}]`, {
                      required: "Debes escoger un insumo!",
                      onChange: (e) =>
                        setValue(`insumoId[${idx}]`, e.target.value),
                    })}
                    description={
                      errorsAddCompra.insumoId?.[idx] &&
                      errorsAddCompra.insumoId?.[idx].message
                    }
                    label="Insumo"
                  >
                    {insumos.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.nombre}
                      </option>
                    ))}
                  </SelectDash>
                  <InputDash
                    {...registerCompra(`cantidad[${idx}]`, {
                      required: "La cantidad es requerida",
                      pattern: {
                        value: /^\d+(.\d+)?$/,
                        message: "Solo se permiten números",
                      },
                      min: {
                        message: "¡Debes ingresar una cantidad mayor a cero!",
                        value: 1,
                      },
                      max: { message: "¡Límite máximo de 250!", value: 250 },
                      onChange: (e) => {
                        let { value } = e.target;
                        const regex = /^-?\d+(\.\d*)?$/;
                        if (!regex.test(value)) {
                          value = value.replace(/[^0-9.-]/g, "");
                          if (value.includes(".") && !/\d+\./.test(value)) {
                            value = value.replace(".", "");
                          }
                        }
                        setValue(`cantidad[${idx}]`, value);
                      },
                    })}
                    label={`Cantidad en ${getUnidadMedida(
                      watch(`insumoId[${idx}]`)
                    )}`}
                    type="text"
                    description={
                      errorsAddCompra.cantidad?.[idx] &&
                      errorsAddCompra.cantidad?.[idx].message
                    }
                  />
                  <InputDash
                    {...registerCompra(`valorTotal[${idx}]`, {
                      required:
                        "La cantidad es requerida en pesos Colombianos (COP)",
                      pattern: {
                        value: /^\d+$/,
                        message: "Solo se permiten números",
                      },
                      min: {
                        message: "¡Mínimo de compra 2000 pesos colombianos!",
                        value: 2000,
                      },
                      onChange: (e) => {
                        let { value } = e.target;
                        value = value.replace(/\D/g, "");
                        setValue(`valorTotal[${idx}]`, value);
                      },
                    })}
                    label="Valor Compra ($COP)"
                    type="text"
                    description={
                      errorsAddCompra.valorTotal?.[idx] &&
                      errorsAddCompra.valorTotal?.[idx].message
                    }
                  />
                </div>
              ))}
          </DialogContent>
          <CustomDialogActions
            cancelButton
            saveButton
            handleClose={() => toggleState(setOpenModal)}
          />
        </form>
      </Dialog>
      <ToastContainer></ToastContainer>
    </>
  );
};
export default Compras;
