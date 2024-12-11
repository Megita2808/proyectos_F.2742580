"use client";
import AlertWarning from "@/components/Alerts/AlertWarning";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Image from "next/image";
import es_ES from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import ImageInput from "@/components/ImageInput/ImageInput";
import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { useCart } from "@/context/CartContext";
import { RangePickerProps } from "antd/es/date-picker";
import { useRouter } from "next/navigation";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TableRow,
  TableCell,
  Collapse,
  Table,
  TableBody,
  TableHead,
  Radio,
  FormControlLabel,
  RadioGroup, 
  SelectChangeEvent,
} from "@mui/material";
import CardTable from "@/components/Tables/CardTable";
import { DatePicker, Space, ConfigProvider } from "antd";
import { checkToken } from "@/api/validations/check_cookie";
import { validateLogin } from "@/api/validations/validate_login";
import { fetchAddressesByUser } from "@/api/fetchs/get_direcciones";
import { Direccion } from "@/types/admin/Direccion";
import ListaDir from "@/components/Lista/ListaDir";
import BasicModal from "@/components/Modals/BasicModal";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import { postReservations } from "@/api/fetchs/posts/post_reserva";
import { parseJSON } from "date-fns";
import CheckCart from "./CheckCart";
import Fecha from "../Pricing/FiltroFecha";
import { useAuth } from "@/context/AuthContext";

function formatCurrency(value: string | number): string {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return "Invalid price";
  }
  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface ImageData {
  uid: string;
  name: string;
  status: string;
  url: string;
}

const reservas: React.FC = () => {
  const {
    cartItems,
    cantBadge,
    removeFromCart,
    updateCartItemQuantity,
    deleteCart,
  } = useCart();
  const [removedItemId, setRemovedItemId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { Step } = Steps;
  const router = useRouter();
  const { RangePicker } = DatePicker;
  const dates = JSON.parse(sessionStorage.getItem("dates") || "null");
  const onDateChange = (dates: [string, string] | null) => {
    return;
  };
  const [loginData, setLoginData] = useState({ mail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [idUser, setIdUser] = useState();
  const [isDireccionesLoading, setIsDireccionesLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const [typeshipping, setTypeShipping] = useState<string>("");
  const [pagoTipo, setPagoTipo] = useState<string>("Efectivo");
  const [selectedValue, setSelectedValue] = useState<string>("Efectivo");
  const [images, setImages] = useState<ImageData[]>([]);
  const [clearImages, setClearImages] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const {dataUser} = useAuth();

  const defaultStartDate = dates ? dates[0] : "";
  const defaultEndDate = dates ? dates[1] : "";

  useEffect(() => {
    const storedCarrito = localStorage.getItem("cart");
    const storedDates = sessionStorage.getItem("dates");

    if (!storedCarrito || !storedDates) {
      alert("No hay alguna de las 2 cosas");
      router.back();
    }
  }, []);

  interface Details {
    id_product: number;
    quantity: number;
  }

  interface FormData {
    id_user: number;
    start_date: string;
    end_date: string;
    id_address: string;
    type_payment: string;
    type_shipping: string;
    shipping_cost: number;
    deposit: number;
    details: any[];
  }

  const [formData, setFormData] = useState<FormData>({
    id_user: 0,
    start_date: defaultStartDate,
    end_date: defaultEndDate,
    id_address: "",
    type_shipping: "",
    type_payment: "Efectivo",
    shipping_cost: 0,
    deposit: 0,
    details: [],
  });

  useEffect(() => {
    if (currentStep === 1) {
      const fetchDirecciones = async () => {
        setIsDireccionesLoading(true);
        try {
          if (idUser) {
            const addresses = await fetchAddressesByUser(idUser);
            setDirecciones(addresses);
            console.log({ addresses });
          }
        } catch (error) {
          console.error("Error al cargar direcciones:", error);
        } finally {
          setIsDireccionesLoading(false);
        }
      };
      fetchDirecciones();
    }
  }, [currentStep]);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const { result, data } = await checkToken();
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length <= 0) {
        let timerInterval: number | NodeJS.Timeout;
        await Swal.fire({
          icon: "warning",
          iconColor: "#000",
          color: "#000",
          title: "Error",
          html: "No tienes productos en tu carrito <b>3</b> segundos...",
          timerProgressBar: true,
          showConfirmButton: false,
          cancelButtonColor: "#000",
          cancelButtonText: "Cerrar",
          timer: 3000,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: "custom-background",
          },
          didOpen: () => {
            const htmlContainer = Swal.getHtmlContainer();
            if (htmlContainer) {
              const b = htmlContainer.querySelector("b");
              if (b) {
                let remainingTime = 3;
                timerInterval = setInterval(() => {
                  remainingTime -= 1;
                  b.textContent = remainingTime.toString();
                  if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                  }
                }, 1000);
              }
            }
          },
        });
        router.push("/catalogo");
      }
      const detalles = Array.isArray(cartItems)
        ? cart.map((item: any) => ({
            id_product: item.id,
            quantity: item.quantity,
          }))
        : [];
      setFormData((prevState) => ({
        ...prevState,
        details: detalles,
      }));

      if (result) {
        setCurrentStep(1);
        setIdUser(data.id_user);
        setFormData((prevState) => ({
          ...prevState,
          id_user: data.id_user,
        }));
        setFormData((prevState) => ({
          ...prevState,
          details: detalles,
        }));
      }
    };
    checkIfLoggedIn();
  }, [login]);

  const handleChangeAddress = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      id_address:  value.toString(), 
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleEnvioTipoChange = (
    event: React.ChangeEvent<HTMLSelectElement>, // Cambia el tipo del evento
  ) => {
    const { value } = event.target; // Extrae el valor directamente del target
    setTypeShipping(value);
    setFormData(prevState => ({
      ...prevState,
      type_shipping: value,
    }));
  };

  const [envioCost, setEnvioCost] = useState<number>(0);


  const calculateProductSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const [deposit,setDeposit] = useState<number>(0);

  


  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    // Define el costo de transporte
    let envioCost = 0;
    if (formData.type_shipping === "Solo Recogida") {
      envioCost = 50000; 
    } else if (formData.type_shipping === "Solo Entrega") {
      envioCost = 50000; 
    } else if (formData.type_shipping === "Recogida y Entrega") {
      envioCost = 100000; 
    } else {
      envioCost = 0; 
    }

    const calculatedDeposit = subtotal * 0.10; 
    setDeposit(calculatedDeposit);

    setFormData(prevState => ({
      ...prevState,
      deposit: calculatedDeposit,
      shipping_cost: envioCost
    }));

    // setTypeShipping(envioCost);
    setEnvioCost(envioCost);

    return subtotal + envioCost + calculatedDeposit; 
  };

  useEffect(() => {
      const newTotal = calculateTotal();
      setTotal(newTotal); 
    
  }, [cartItems, typeshipping]); 

  const handlePagoTipoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value); // Actualiza el valor seleccionado
    setFormData(prevState => ({
      ...prevState,
      type_payment: value, // Actualiza type_payment en formData
    }));
  };

  const handleRemoveItem = (itemId: number) => {
    setRemovedItemId(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovedItemId(null);
    }, 300);
  };

  const handleIncreaseQuantity = (itemId: number) => {
    updateCartItemQuantity(itemId, 1);
  };

  const handleDecreaseQuantity = (itemId: number) => {
    updateCartItemQuantity(itemId, -1);
  };

  const disabledDate = (current: any) => {
    return current && current.isBefore(dayjs().startOf("day"), "day");
  };

  const handleDateChange: RangePickerProps["onChange"] = (
    dates,
    dateStrings,
  ) => {
    if (dates) {
      onDateChange([dateStrings[0], dateStrings[1]]);
    } else {
      onDateChange(null);
    }
  };

  const handleFinalizar = async () => {
    if (!pagoTipo) {
      let timerInterval: number | NodeJS.Timeout;
        await Swal.fire({
          icon: "warning",
          iconColor: "#000",
          color: "#000",
          title: "Error",
          html: "Por favor selecciona un método de pago antes de continuar. <b>3</b> segundos...",
          timerProgressBar: true,
          showConfirmButton: false,
          cancelButtonColor: "#000",
          cancelButtonText: "Cerrar",
          timer: 3000,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: "custom-background",
          },
          didOpen: () => {
            const htmlContainer = Swal.getHtmlContainer();
            if (htmlContainer) {
              const b = htmlContainer.querySelector("b");
              if (b) {
                let remainingTime = 3;
                timerInterval = setInterval(() => {
                  remainingTime -= 1;
                  b.textContent = remainingTime.toString();
                  if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                  }
                }, 1000);
              }
            }
          },
        });
    }

    if (!formData.id_address) {
      let timerInterval: number | NodeJS.Timeout;
        await Swal.fire({
          icon: "warning",
          iconColor: "#000",
          color: "#000",
          title: "Error",
          html: "Por favor selecciona una dirección antes de continuar. <b>3</b> segundos...",
          timerProgressBar: true,
          showConfirmButton: false,
          cancelButtonColor: "#000",
          cancelButtonText: "Cerrar",
          timer: 3000,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: "custom-background",
          },
          didOpen: () => {
            const htmlContainer = Swal.getHtmlContainer();
            if (htmlContainer) {
              const b = htmlContainer.querySelector("b");
              if (b) {
                let remainingTime = 3;
                timerInterval = setInterval(() => {
                  remainingTime -= 1;
                  b.textContent = remainingTime.toString();
                  if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                  }
                }, 1000);
              }
            }
          },
        });
    }

    const updatedFormData = {
      ...formData,
      shipping_cost: envioCost,
      deposit: deposit,
    };
  
    try {
      const response = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro de que deseas finalizar tu reserva?",
        iconColor: "#000",
        color: "#000",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#6A0DAD",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      }).then((res) => res.isConfirmed);
      console.log({updatedFormData})
      if (response) {
        const createdReservation = await postReservations(updatedFormData);
        setFormData({
          id_user: 0,
          start_date: "",
          end_date: "",
          id_address: "",
          type_shipping: "",
          type_payment: "",
          shipping_cost: 0,
          deposit: 0,
          details: [],
        });
        deleteCart();
        const response = await Swal.fire({
          title: "Reserva realizada!!",
          text: "Vamos a ver los detalles de tu reserva",
          iconColor: "#000",
          color: "#000",
          icon: "success",
          cancelButtonColor: "#000",
          confirmButtonColor: "#6A0DAD",
          confirmButtonText: "Mis Reservas",
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: "custom-background",
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
          },
        })
        router.push("/mis_reservas");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar la Reserva. Revisa los datos e intenta nuevamente.",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await validateLogin(loginData, setLoading);

      if (response.result) {
        localStorage.setItem("isAuthenticated", "true");

        await Swal.fire({
          icon: "success",
          iconColor: "#000",
          color: "#000",
          title: "Bienvenido!",
          html: "Inicio de Sesión Exitoso",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: "custom-background",
          },
        });
        setLogin(true);
      } else {
        await Swal.fire({
          icon: "error",
          iconColor: "#000",
          color: "#000",
          title: "Error",
          text: "Correo o contraseña incorrectos",
          // confirmButtonColor: "#000",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al iniciar sesión. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = () => {
    Swal.fire({
      title: "Escanéa el QR",
      html: `
        <div id="image-upload-container" style="text-align: center;">
          <div style="margin-bottom: 15px;">
            <img src="/images/qr_transferencias.jpeg" alt="QR Transferencias">
            <div id="image-input"></div>
          </div>
        </div>
      `,
      showCancelButton: false,
      showConfirmButton: false,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });
  };

  return (
    <Container>
      <CheckCart />
      <Steps current={1}>
        <Step
          title={<span className="dark:text-white">Login</span>}
          icon={<UserOutlined style={{ color: "#5750f1" }} />}
        />
        <Step
          title={<span className="dark:text-white">Detalles</span>}
          icon={<SolutionOutlined style={{ color: "#5750f1" }} />}
        />
        <Step
          title={<span className="dark:text-white">Pago</span>}
          icon={<LoadingOutlined style={{ color: "#5750f1" }} />}
        />
        <Step
          title={<span className="dark:text-white">Finalizado</span>}
          icon={<SmileOutlined style={{ color: "#5750f1" }} />}
        />
      </Steps>

      {currentStep === 0 && (
        <Card
          variant="outlined"
          sx={{ padding: 2, marginTop: 2 }}
          className="dark:bg-dark dark:text-white"
        >
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <div
            className="wow fadeInUp relative mx-auto max-w-[1200px] overflow-hidden rounded-lg bg-white px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]"
            data-wow-delay=".15s"
          >
            <form onSubmit={handleLogin}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* <TextField
                    id="email"
                    label="Correo"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    color="info"
                    InputProps={{
                      style: { color: "white" },
                    }}
                    value={loginData.mail}
                    onChange={(e) =>
                      setLoginData({ ...loginData, mail: e.target.value })
                    }
                  /> */}
                  <input
                    type="email"
                    placeholder="Correo"
                    value={loginData.mail}
                    onChange={(e) =>
                      setLoginData({ ...loginData, mail: e.target.value })
                    }
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <TextField
                    id="password"
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      style: { color: "white" },
                    }}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    color="info"
                  /> */}
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <Button
                    className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transitionduration-300 hover:bg-primary/90 hover:text-white lg:mt-0"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </Button> */}

                  <button
                    className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
                    // fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Card>
      )}

      {currentStep === 1 && (
        <Card
          variant="outlined"
          sx={{ padding: 2, marginTop: 2 }}
          className="dark:bg-dark dark:text-white"
        >
          <Typography variant="h4" align="center" gutterBottom>
            Detalles de la Reserva
          </Typography>
          <div
            className="wow fadeInUp relative mx-auto max-w-[1200px] overflow-hidden rounded-lg bg-white px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]"
            data-wow-delay=".15s"
          >
            <form>
              <Grid container spacing={2} alignItems="center">
                {/* Primer contenedor para las fechas */}
                <Grid item xs={12} sm={6} md={6}>
                  <ConfigProvider
                    locale={es_ES}
                    theme={{
                      token: {
                        colorPrimary: "#5750f1",
                      },
                    }}
                  >
                    <Space direction="vertical" size={14}>
                      <RangePicker
                        size="large"
                        disabled
                        defaultValue={
                          dates && dates.length === 2
                            ? [dayjs(dates[0]), dayjs(dates[1])]
                            : undefined
                        }
                        onChange={handleDateChange}
                        disabledDate={disabledDate}
                        className="input custom-range-picker w-full rounded-xl border-gray-300 px-5 py-3 text-dark-6 shadow-lg transition-all focus:border dark:bg-dark-4"
                      />
                    </Space>
                  </ConfigProvider>
                </Grid>

                {/* Segundo contenedor para la selección de dirección */}
                <Grid item xs={12} sm={6} md={6}>
                  <div className="flex items-center justify-between">
                    {isDireccionesLoading ? (
                      <MenuItem disabled>Cargando...</MenuItem>
                    ) : idUser ? (
                      <div className="w-full">
                        <SelectGroupOne
                          id="address"
                          name="address"
                          label="Mis Direcciones"
                          placeholder="Selecciona una dirección"
                          customClasses="mb-3 w-full"
                          required
                          value={formData.id_address.toString()}
                          opciones={direcciones.map((dir) => {
                            return { id: dir.id_address, name: dir.name };
                          })}
                          onChange={handleChangeAddress}
                        />
                      </div>
                    ) : (
                      <div>
                        <Typography>No estás registrado</Typography>
                      </div>
                    )}
                  </div>
                </Grid>

                {/* Selección del tipo de envío */}
                <Grid item xs={12} sm={6} md={6}>
                  <div className="flex items-center justify-between">
                    {isDireccionesLoading ? (
                      <MenuItem disabled>Cargando...</MenuItem>
                    ) : idUser ? (
                      <div className="w-full">
                        <SelectGroupOne
                          id="envio-tipo"
                          name="envio-tipo"
                          label="Tipo de Envío"
                          placeholder="Selecciona un tipo de envío"
                          customClasses="mb-3 w-full"
                          required
                          value={typeshipping}
                          opciones={[
                            {
                              id: "Recogida y Entrega",
                              name: "Recogida y Entrega",
                            },
                            { id: "Solo Recogida", name: "Solo Recogida" },
                            { id: "Solo Entrega", name: "Solo Entrega" },
                            { id: "Sin envio", name: "Sin Envío" },
                          ]}
                          onChange={handleEnvioTipoChange}
                        />
                      </div>
                    ) : (
                      <div>
                        <Typography>No hay tipos de envios</Typography>
                      </div>
                    )}
                  </div>
                </Grid>

                {/* Botón para continuar */}
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="space-between"
                >
                  <button
                    onClick={handleNextStep}
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-110 hover:bg-primary/90 hover:text-white dark:text-white"
                    // className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-primary/90"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Continuar"}
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Card>
      )}

      {currentStep === 2 && (
        <Card
          variant="outlined"
          sx={{ padding: 2, marginTop: 2 }}
          className="dark:bg-dark dark:text-white"
        >
          <div
            className="wow fadeInUp relative mx-auto max-w-[1200px] overflow-hidden rounded-lg bg-white px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]"
            data-wow-delay=".15s"
          >
            <Grid item xs={12} sm={6} md={6}>
              <label>Selecciona tu metodo de pago</label>
              <div>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="payment-method"
                    name="payment-method"
                    value={selectedValue}
                    onChange={handlePagoTipoChange}
                    row
                  >
                    <FormControlLabel
                      value="Efectivo"
                      control={<Radio />}
                      label="Efectivo"
                    />
                    <FormControlLabel
                      value="Transferencia"
                      control={<Radio />}
                      label="Transferencia"
                      onClick={openImageModal}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </Grid>
            <div>
              {pagoTipo == "Transferencia" ? (
                <div className="p-4 w-[200%]">
                  <Image
                    src="/images/qr_transferencias.jpeg"
                    alt="producto"
                    width={200}
                    height={200}
                    className="h-16 w-16 rounded-md object-cover shadow-lg"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className=" flex flex-row gap-5">
              <button
                onClick={handlePreviousStep}
                className="mb-2 flex w-full  cursor-pointer items-center justify-center rounded-md border-2 border-red px-4 py-2 font-bold text-red !duration-300 hover:scale-100 hover:bg-red hover:text-white dark:text-white"
                // className="hover:bg-red-90 mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border border-red-500 bg-red-500 px-5 py-3
                // text-base text-white transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Volver"}
              </button>
              {/* <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onClick={handleFinalizar}
                  className="flex w-full cursor-pointer items-center justify-center 
                rounded-md border border-primary bg-primary px-5 py-3 text-base text-white 
                transition duration-300 ease-in-out hover:bg-primary/90"
                >
                  Finalizar
                </Button> */}
              <button
                onClick={handleFinalizar}
                className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
                // className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3
                // text-base text-white transition duration-300 ease-in-out hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Finalizar"}
              </button>
            </div>
          </div>
        </Card>
      )}

      {currentStep === 3 && (
        <Typography variant="h4" align="center" sx={{ marginTop: 2 }}>
          Proceso Completado
        </Typography>
      )}
      {/* Parte de donde se ven los productos*/}
      <div className="mt-2 flex h-full flex-col justify-between space-y-4 text-dark dark:text-white">
        {cartItems.length > 0 ? (
          <div className="flex flex-grow flex-col space-y-4 overflow-y-auto overflow-x-hidden">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`flex transform cursor-pointer items-center justify-between rounded-lg border-b border-gray-200 p-4 transition-all hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-dark-3 ${
                  removedItemId === item.id ? "scale-95 opacity-0" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.image || "https://via.placeholder.com/60"}
                    alt="producto"
                    width={60}
                    height={60}
                    className="h-16 w-16 rounded-md object-cover shadow-lg"
                  />
                  <div className="flex flex-col justify-between">
                    <span className="text-base font-semibold text-gray-800 dark:text-white">
                      {item.name.length > 20
                        ? `${item.name.slice(0, 20)}...`
                        : item.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad:
                      <div className="mt-1 flex items-center space-x-2">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="rounded-lg bg-gray-200 p-2 text-gray-800 transition duration-200 hover:bg-gray-300"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-md text-gray-800 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="rounded-lg bg-gray-200 p-2 text-gray-800 transition duration-200 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Precio: {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="rounded-lg p-2 text-red-600 transition duration-300 hover:text-red-800"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <ClearOutlinedIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <AlertWarning title="Tu carrito está vacío" />
          </div>
        )}
        {cartItems.length > 0 && (
          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={10000}
            >
              <Collapse in={true} timeout="auto" unmountOnExit>
                <div className="flex justify-center">
                  <div className="min-h-[400px] w-full max-w-[1000px] rounded-xl bg-primary/[.2] p-4 shadow-lg">
                    <CardTable
                      customClasses="bg-primary/[.2]"
                      data={
                        <Table
                          size="small"
                          aria-label="costos"
                          className="w-full rounded-xl border-2 border-gray-400"
                        >
                          <TableHead>
                            <TableRow className="h-[80px] rounded-xl">
                              <TableCell className="h-[80px] w-1/3 py-6 text-lg font-bold dark:text-dark-6">
                                Descripción
                              </TableCell>
                              <TableCell className="h-[80px] w-1/3 py-6 text-right text-lg font-bold dark:text-dark-6">
                                Monto
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow className="h-[80px]">
                              <TableCell className="py-6 dark:bg-gray-dark dark:text-gray-400">
                                Subtotal de productos
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                {formatCurrency(calculateProductSubtotal())}
                              </TableCell>
                            </TableRow>
                            <TableRow className="h-[80px]">
                              <TableCell className="py-6 dark:bg-gray-dark dark:text-gray-400">
                                Deposito
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                ${deposit.toLocaleString("en-US")}
                              </TableCell>
                            </TableRow>
                            <TableRow className="h-[80px]">
                              <TableCell className="py-6 dark:bg-gray-dark dark:text-gray-400">
                                Envío
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                ${envioCost.toLocaleString("en-US")}
                              </TableCell>
                            </TableRow>
                            <TableRow className="h-[80px]">
                              <TableCell
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                                colSpan={1}
                              >
                                <span className="text-2xl font-semibold text-gray-800 dark:text-white">
                                  Total:
                                </span>
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                <span className="text-xxl font-semibold text-gray-800 dark:text-white">
                                  ${total.toLocaleString("en-US")}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      }
                    />
                  </div>
                </div>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </div>
    </Container>
  );
};

export default reservas;
