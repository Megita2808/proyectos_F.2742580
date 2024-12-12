//mirando
import "./catalogoDashboard.css";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { AddRounded } from "../../components/svg/Svg";
import "slick-carousel/slick/slick-theme.css";
import Header from "../../components/Header/Header";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Switch,
  Grid,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Checkbox,
  DialogContentText,
} from "@mui/material";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { alpha, Chip } from "@mui/material";
import useCategoriaData from "../../hooks/useCategoriaData";
import useCatalogoData from "../../hooks/useCatalogoData";
import Transition from "../../components/transition/Transition";
import useTallaData from "../../hooks/useTallaData";
import useInsumosData from "../../hooks/useInsumosData";
import { toast, ToastContainer } from "react-toastify";
import { ColumnsCatalogo } from "../../assets/columns";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import InputDash from "../../components/inputDashboard/InputDash";
import SelectDash from "../../components/selectDash/SelectDash";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import { formToCop, toggleState } from "../../assets/constants.d";
import CheckboxCustom from "../../components/checkbox/CheckBoxCustom";
import { TrashColor } from "../../components/svg/Svg";
import { ViewListOutlined } from "@mui/icons-material";
const CatalogoDashboard = () => {
  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 1500,
    cssEase: "linear",
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSaveCatalogo,
    watch,
    formState: { errors: errorsAddCatalogo },
    register: registerCatalogo,
    reset,
    getValues,
    setValue,
  } = useForm();
  const {
    initialFetchAllCatalogos,
    loading,
    fetchAllCatalogos,
    deleteCatalogo,
    updateCatalogos,
    createCatalogo,
    createCatalogoInsumos,
  } = useCatalogoData();
  const { initialFetchAllCategorias, loading: loadingCategoria } =
    useCategoriaData();
  const { initialFetchAllTallas, loading: loadingTallas } = useTallaData();
  const { initialFetchAllInsumos, loading: loadingInsumos } = useInsumosData();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedTallas, setSelectedTallas] = useState([]);
  const [numberOfInsumos, setNumberOfInsumos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [kindOfTallas, setKindOfTallas] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    row: null,
  });
  useEffect(() => {
    const initialFetchCatalogo = async () => {
      const respuesta = await initialFetchAllCatalogos();
      const categoria = await initialFetchAllCategorias();
      const tallas = await initialFetchAllTallas();
      const insumos = await initialFetchAllInsumos();
      if (
        respuesta.status === 200 &&
        categoria.status === 200 &&
        tallas.status === 200 &&
        insumos.status === 200
      ) {
        setData(respuesta.data);
        setCategorias(categoria.data);
        setTallas(tallas.data);
        setKindOfTallas(
          tallas.data.filter((talla) => talla.tipo === "Alfanumérica")
        );
        setInsumos(
          insumos.data.filter(
            (insumo) => insumo.categoria_insumos.tipo === "Controlado"
          )
        );
      }
    };
    initialFetchCatalogo();
  }, []);
  const handleAddImage = (e) => {
    const file = e.target.files[0];

    if (!file.type.includes("image")) {
      toast.error("¡Solo se permiten imágenes!", {
        toastId: "errorAddingNotAnImage",
        autoClose: 1500,
      });
      return;
    }

    if (imagenes.length === 5) {
      toast.error("¡Máximo 5 imagenes!", {
        toastId: "erroTooManyImages",
        autoClose: 1500,
      });
      return;
    }
    setImagenes((prev) => [...prev, file]);
  };
  console.log(dialogProps.row);

  const handleAddInsumo = () => {
    if (numberOfInsumos.length >= insumos?.length)
      return toast.error("¡Ya has agregado todos tus insumos!", {
        toastId: "errorAllInsumos",
        autoClose: 1500,
      });
    setValue(
      `insumo[${numberOfInsumos.length}]`,
      insumos[numberOfInsumos.length]?.id
    );
    setNumberOfInsumos((prev) => (!prev ? [1] : [...prev, prev.length + 1]));
  };
  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin Categoría";
  };
  const handleSave = async (data) => {
    if (numberOfInsumos.length <= 0 && dialogProps.action != "delete")
      return toast.error("¡Debes añadir mínimo un insumo!", {
        toastId: "errorNoInsumosAdded",
        autoClose: 2000,
      });
    if (imagenes.length <= 0 && dialogProps.action != "delete")
      return toast.error("¡Debes añadir mínimo una imagen!", {
        toastId: "errorNoImageAdded",
        autoClose: 2000,
      });
    let response;
    if (dialogProps.action === "delete") {
      {
        if (dialogProps.row.estadoId === 1)
          return toast.error(
            "¡No se puede eliminar el insumo porque está activo!",
            { autoClose: 1600, toastId: "activeError" }
          );
        response = await deleteCatalogo(dialogProps.row.id);
        if (response.status !== 201 && response.status !== 200)
          return toast.error(response.data, {
            autoClose: 2000,
            toastId: "error",
          });
      }
    } else {
      const {
        insumo,
        cantidad_utilizada,
        tallas,
        producto,
        precio,
        linea,
        peso,
        descripcion,
        categoriaId,
      } = data;
      const tallasNumeros = tallas.map(Number);
      const tallasOrdenadas = tallasNumeros.sort((a, b) => a - b);
      const tallasParsed = tallasOrdenadas.join(",");
      const datosInsumos = [];
      insumo.forEach((insumoId, idx) => {
        datosInsumos.push({
          insumo_id: parseInt(insumoId),
          cantidad_utilizada: parseFloat(cantidad_utilizada[idx]),
        });
      });
      const formDataAddCatalog = new FormData();
      formDataAddCatalog.append("producto", producto);
      formDataAddCatalog.append("precio", precio);
      formDataAddCatalog.append("descripcion", descripcion);
      formDataAddCatalog.append("peso", parseFloat(peso));
      formDataAddCatalog.append("estadoId", 1);
      formDataAddCatalog.append("categoriaId", categoriaId);
      formDataAddCatalog.append("tallas", tallasParsed);
      formDataAddCatalog.append("linea", linea);
      imagenes.forEach((imagen) => formDataAddCatalog.append("file", imagen));
      if (dialogProps.action === "add")
        response = await createCatalogo(formDataAddCatalog);
      if (dialogProps.action === "edit")
        response = await updateCatalogos(
          dialogProps.row.id,
          formDataAddCatalog
        );
      if (response.status !== 201 && response.status !== 200)
        return toast.error(response.data.message, {
          autoClose: 2000,
          toastId: "error",
        });
      const id = response.data.data.id;
      const createFichatecnica = await createCatalogoInsumos({
        catalogoId: id,
        datosInsumos,
      });
    }
    const updatedData = await fetchAllCatalogos();
    setData(updatedData.data);
    toggleState(setOpenModal);
    toast.success(
      `¡Producto ${
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
  const findMaxQuantityInsumo = (id) => {
    const insumo = insumos.find((insumo) => insumo.id === id);
    console.log(insumo);

    return `${parseFloat(
      insumo?.cantidad
    )} ${insumo?.unidades_de_medida.nombre?.toLowerCase()}`;
  };
  const handleDialog = (action, title, row = null) => {
    setDialogProps({ action, row, title });
    setNumberOfInsumos(row?.insumos || []);
    setImagenes(row?.Imagens || []);
    reset({
      producto: row?.producto || "",
      descripcion: row?.descripcion || "",
      precio: row?.precio || "",
      categoriaId: row?.categoriaId || categorias[0]?.id,
      linea: row?.linea || "básica",
      peso: row?.peso || "",
      tallas: row?.tallas || [],
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir al Catálogo");
  };
  const handleEdit = (row) => {
    handleDialog("edit", "Editar producto del Catálogo", row);
    console.log(row);
  };

  const handleCheckboxChange = (tallaId) => {
    setSelectedTallas((prevSelected) =>
      prevSelected.includes(tallaId)
        ? prevSelected.filter((id) => id !== tallaId)
        : [...prevSelected, tallaId]
    );
  };

  useEffect(() => {
    setValue(
      "insumo",
      numberOfInsumos.map((insumo) => insumo.id)
    );
    setValue(
      "cantidad_utilizada",
      numberOfInsumos.map((insumo) => insumo.CatalogoInsumos.cantidad_utilizada)
    );
    if (dialogProps.action === "edit" && dialogProps.row) {
      const tallas = dialogProps.row.tallas;
      setSelectedTallas(tallas);
    } else {
      setSelectedTallas([]);
    }
  }, [dialogProps]);
  const handleDelete = (row) => {
    handleDialog("delete", "Eliminar del Catálogo", row);
  };
  const handlePreview = (row) => {
    handleDialog("preview", "Vista previa", row);
  };
  const handleMolde = (row) => {
    handleDialog("molde", "Molde", row);
  };
  const handleChangeState = async (e, row) => {
    const newState = e.target.checked ? 1 : 2;
    const respuesta = await updateCatalogos(row.id, { estadoId: newState });
    if (respuesta.status !== 200 && respuesta.status !== 201)
      return toast.error("¨¡Error al actualizar el estado!", {
        toastId: "error",
        autoClose: 1300,
      });
    const updatedData = await fetchAllCatalogos();
    setData(updatedData.data);
  };
  const columns = ColumnsCatalogo({
    getCategoriaNombre: getCategoriaNombre,
    onEdit: handleEdit,
    onDelete: handleDelete,
    changeState: handleChangeState,
    OnPreview: handlePreview,
  });

  return (
    <>
      <Header
        title={"Productos"}
        handleAdd={handleAdd}
        buttonText={"Agregar producto"}
        icon={ViewListOutlined}
      />
      <br />
      <ContainerDataGrid>
        {loading || loadingCategoria || loadingInsumos || loadingTallas ? (
          <LoadingTableData />
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "asc" }],
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
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxWidth: "none",
          },
        }}
      >
        <form onSubmit={handleSaveCatalogo(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "delete" ? (
              <DialogContentText
                sx={{ textAlign: "center" }}
              >{`¿Estás seguro de que deseas eliminar el profucto del catálogo con nombre "${dialogProps.row.producto}" ?`}</DialogContentText>
            ) : dialogProps.action === "preview" ? (
              <div className="catalagoCard">
                <div class="catalogo-imagen">
                  <img
                    src={dialogProps.row.Imagens[0].url}
                    alt="Imagen del producto"
                  />
                  <div className="insumosCatalogo">
                    {dialogProps.row.insumos.length >= 1 &&
                      dialogProps.row.insumos.map((insumo) => (
                        <div key={insumo.id} className="campoInsumo">
                          <label>{insumo.nombre}:</label>
                          <span>
                            {insumo.CatalogoInsumos.cantidad_utilizada} Metros
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div class="catalogo-info">
                  <div class="campo">
                    <label>Nombre:</label>
                    <span>{dialogProps.row.producto}</span>
                  </div>

                  <div class="campoObjetivo">
                    <label>Descripcion:</label>
                    <br />
                    <span className="objetivo-text">
                      {dialogProps.row.descripcion}
                    </span>
                  </div>
                  <div class="campo">
                    <label>Precio:</label>
                    <span>{formToCop(dialogProps.row.precio)}</span>
                  </div>
                  <div class="campo">
                    <label>Categoría:</label>
                    <span>
                      {getCategoriaNombre(dialogProps.row.categoriaId)}
                    </span>
                    <span
                      onClick={() => {
                        toggleState(setOpenModal);
                        handleMolde(dialogProps.row);
                      }}
                      className="molde"
                    >
                      Ver molde
                    </span>
                  </div>
                  <div class="campo">
                    <label>Linea:</label>
                    <span>{dialogProps.row.linea}</span>
                  </div>
                </div>
              </div>
            ) : dialogProps.action === "molde" ? (
              <div style={{ width: "100%", height: "500px" }}>
                <iframe
                  src={dialogProps.row.categoria_prendas.molde}
                  title="PDF Viewer"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <div>
                <div className="formProductDash">
                  <div className="inputProduct">
                    <InputDash
                      {...registerCatalogo("producto", {
                        required:
                          "El producto del catálogo necesita un nombre.",
                        minLength: {
                          message:
                            "¡El nombre del producto debe tener mínimo 4 caracteres!",
                          value: 4,
                        },
                        maxLength: {
                          message: "¡Máximo permitido 50 caracteres!",
                          value: 50,
                        },
                      })}
                      description={
                        errorsAddCatalogo.producto &&
                        errorsAddCatalogo.producto.message
                      }
                      type="text"
                      label="Nombre"
                    />
                    <InputDash
                      {...registerCatalogo("descripcion", {
                        required:
                          "El producto del catálogo necesita una descripción.",
                        minLength: {
                          message:
                            "¡La descripción del producto debe tener mínimo 4 caracteres!",
                          value: 4,
                        },
                        maxLength: {
                          message: "¡Máximo permitido 255 caracteres!",
                          value: 255,
                        },
                      })}
                      description={
                        errorsAddCatalogo.descripcion &&
                        errorsAddCatalogo.descripcion.message
                      }
                      type="text"
                      label="Descripción"
                    />
                    <InputDash
                      {...registerCatalogo("precio", {
                        required:
                          "La cantidad es requerida en pesos Colombianos (COP)",
                        pattern: {
                          value: /^\d+$/,
                          message: "Solo se permiten números",
                        },
                        min: {
                          message: "¡Mínimo de compra 5000 pesos colombianos!",
                          value: 5000,
                        },
                        onChange: (e) => {
                          let { value } = e.target;
                          value = value.replace(/\D/g, "");
                          e.target.value = value;
                        },
                      })}
                      label="Precio"
                      type="text"
                      description={
                        errorsAddCatalogo.precio &&
                        errorsAddCatalogo.precio.message
                      }
                    />
                    <InputDash
                      {...registerCatalogo("peso", {
                        required:
                          "El producto del catálogo necesita un peso en Kg.",
                        pattern: {
                          value: /^\d+(.\d+)?$/,
                          message: "Solo se permiten números",
                        },
                        min: {
                          value: 0,
                          message: "¡La cantidad mínima es de 0!",
                        },
                        maxLength: {
                          message: "¡Máximo permitido 100 kg!",
                          value: 100,
                        },
                      })}
                      description={
                        errorsAddCatalogo.peso && errorsAddCatalogo.peso.message
                      }
                      type="text"
                      label="Peso (Kg)"
                    />
                    <SelectDash
                      {...registerCatalogo("categoriaId", {
                        required: "Debes escoger una categoría!",
                      })}
                      label="Categoría"
                      description={
                        errorsAddCatalogo.categoriaId &&
                        errorsAddCatalogo.categoriaId.message
                      }
                    >
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </SelectDash>
                    <SelectDash
                      {...registerCatalogo("linea", {
                        required: "Debes escoger una línea!",
                      })}
                      label="Línea"
                      description={
                        errorsAddCatalogo.linea &&
                        errorsAddCatalogo.linea.message
                      }
                    >
                      <option value="premium">Premium</option>
                      <option value="especial">Especial</option>
                      <option value="básica">Básica</option>
                      <option value="temporada">Temporada</option>
                      <option value="ecológica">Ecológica</option>
                      <option value="accesorios">Accesorios</option>
                      <option value="infantil">Infantil</option>
                      <option value="deportiva">Deportiva</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                    </SelectDash>
                  </div>

                  <div className="tallasProduct">
                    <div className="tallas-div">
                      <h4>Tallas</h4>
                      <div className="switch-tallas-father">
                        <h5>Numéricas</h5>
                        <Switch
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: colors.purple[200],
                              "&:hover": {
                                backgroundColor: alpha(
                                  colors.purple[200],
                                  theme.palette.action.hoverOpacity
                                ),
                              },
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: colors.purple[200],
                              },
                          }}
                          onChange={(e) => {
                            if (e.target.checked)
                              return setKindOfTallas(
                                tallas.filter(
                                  (talla) => talla.tipo === "alfanumérica"
                                )
                              );
                            return setKindOfTallas(
                              tallas.filter(
                                (talla) => talla.tipo === "numérica"
                              )
                            );
                          }}
                          defaultChecked
                          size="small"
                        />
                        <h5>Alfanuméricas</h5>
                      </div>
                    </div>
                    <section className="tallas-grid">
                      {kindOfTallas
                        .sort((a, b) => a.id - b.id)
                        .map((talla) => (
                          <CheckboxCustom
                            key={talla.id}
                            {...registerCatalogo(`tallas`, {
                              required: "¡Debes elegir mínimo una talla!",
                            })}
                            handlecheckbox={handleCheckboxChange}
                            checked={selectedTallas.includes(talla.id)}
                            permisoName={`${talla.nombre}`}
                            idPermiso={talla.id}
                          />
                        ))}
                    </section>
                    {errorsAddCatalogo.tallas && (
                      <span style={{ color: "rgb(250, 24, 24)" }}>
                        {errorsAddCatalogo.tallas.message}
                      </span>
                    )}
                  </div>
                </div>

                <h4>Imagen de referencia</h4>
                <div style={{ width: "100%" }}>
                  <label className="subir-img">
                    <input
                      onChange={handleAddImage}
                      type="file"
                      accept="image/*"
                      multiple
                    />
                    <div style={{ width: "100%" }}>
                      {imagenes.length > 0
                        ? `Subir imagen (${imagenes.length} de 5)`
                        : "Subir imagen"}
                    </div>
                  </label>
                  <DialogTitle sx={{ color: "red", fontSize: ".8rem" }}>
                    {errorsAddCatalogo?.imagen?.message}
                  </DialogTitle>
                </div>
                <div
                  style={{
                    width: "48%",
                    margin: "0 auto",
                  }}
                >
                  {imagenes.length > 1 ? (
                    <Slider {...sliderSettings}>
                      {imagenes.map((imagen, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setImagenes((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                          }}
                          className="image-container"
                        >
                          <img
                            src={
                              imagen.url
                                ? imagen.url
                                : URL.createObjectURL(imagen)
                            }
                            alt={`Imagen ${idx}`}
                            className="image"
                          />
                          <div className="overlay">
                            <TrashColor size={38} color={"#fff"}></TrashColor>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    imagenes.length > 0 && (
                      <div
                        className="image-container"
                        onClick={() => setImagenes([])}
                      >
                        <img
                          src={
                            imagenes[0].url
                              ? imagenes[0].url
                              : URL.createObjectURL(imagenes[0])
                          }
                          alt={`Imagen `}
                          className="image"
                        />
                        <div className="overlay">
                          <TrashColor size={38} color={"#fff"}></TrashColor>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <DialogTitle
                  sx={{
                    mt: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  color={colors.grey[100]}
                >
                  <span>
                    {insumos.length > 0
                      ? "Añadir insumos"
                      : "¡No tienes insumos registrados en el aplicativo!"}
                  </span>{" "}
                  {numberOfInsumos.length < insumos?.length && (
                    <Button onClick={handleAddInsumo}>
                      <AddRounded size={24} color={"#fff"}></AddRounded>
                    </Button>
                  )}
                </DialogTitle>
                {numberOfInsumos.length >= 1 ? (
                  numberOfInsumos.map((_, idx) => (
                    <div className="gridInsumoSection">
                      <div
                        style={{ marginTop: "10px" }}
                        key={idx}
                        className="add-insumo-section"
                      >
                        <div>
                          <SelectDash
                            label="Insumo"
                            width="200px"
                            {...registerCatalogo(`insumo[${idx}]`, {
                              required: "Debes escoger un insumo!",
                              onChange: (e) =>
                                setValue(`insumo[${idx}]`, e.target.value),
                            })}
                            description={
                              errorsAddCatalogo?.insumo?.[idx]?.message
                            }
                          >
                            {insumos.map((ins) => (
                              <option key={ins.id} value={ins.id}>
                                {ins.nombre}
                              </option>
                            ))}
                          </SelectDash>
                        </div>
                        <div>
                          <InputDash
                            width="320px"
                            allowDecimal
                            label={`Cantidad usada (Máximo ${findMaxQuantityInsumo(
                              parseFloat(getValues(`insumo[${idx}]`))
                            )})`}
                            type="number"
                            {...registerCatalogo(`cantidad_utilizada[${idx}]`, {
                              required: "¡La cantidad usada es requerida!",
                              pattern: {
                                value: /^\d+(.\d+)?$/,
                                message: "Solo se permiten números",
                              },
                              min: {
                                value: 1,
                                message: "¡La cantidad mínima es de 1!",
                              },
                              max: {
                                value: findMaxQuantityInsumo(
                                  parseFloat(watch(`insumo[${idx}]`))
                                ),
                                message: `¡La cantidad máxima es de ${findMaxQuantityInsumo(
                                  parseFloat(watch(`insumo[${idx}]`))
                                )}!`,
                              },
                            })}
                            onChange={(e) =>
                              setValue(
                                `cantidad_utilizada[${idx}]`,
                                e.target.value
                              )
                            }
                            description={
                              errorsAddCatalogo?.cantidad_utilizada?.[idx]
                                ?.message
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="clickInsumo">
                    Dale click a agregar un insumo! ▲
                  </div>
                )}
              </div>
            )}
          </DialogContent>

          {dialogProps.action === "preview" ? (
            <CustomDialogActions
              cancelButton
              handleClose={() => toggleState(setOpenModal)}
            />
          ) : (
            <CustomDialogActions
              cancelButton
              customCancelColor={dialogProps.action === "delete" && "inherit"}
              saveButton={
                dialogProps.action !== "delete" &&
                dialogProps.action !== "molde"
              }
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

export default CatalogoDashboard;
