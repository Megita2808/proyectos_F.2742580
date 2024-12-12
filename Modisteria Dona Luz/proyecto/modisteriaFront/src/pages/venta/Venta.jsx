import "./venta.css";
import Metadata from "../../components/metadata/Metadata";
import { useJwt } from "../../context/JWTContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useDecodedJwt from "../../hooks/useJwt";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input_basico/Input";
import { useForm } from "react-hook-form";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import { QrCode } from "../../components/svg/Svg";
import { toast, ToastContainer } from "react-toastify";
import useActiveUserInfo from "../../hooks/useActiveUserInfo";
import useIsFirstRender from "../../hooks/useIsMount";
import {
  formToCop,
  imageExtensions,
  municipios,
  URL_BACK,
} from "../../assets/constants.d";
import useFetch from "../../hooks/useFetch";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import SelectDash from "../../components/selectDash/SelectDash";
import useVentas from "../../hooks/useVentasData";
export default function Venta() {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const [elegirPago, setElegirPago] = useState(false);
  const isFirstRender = useIsFirstRender();
  const { loading: loadingFetch, triggerFetch } = useFetch();
  const { cartData, subtotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(false);
  const { calcularDomicilio } = useVentas();
  const [lugarEntrega, setLugarEntrega] = useState("modisteria");
  const [file, setImagen] = useState(null);
  const [nombreComprobante, setNombreComprobante] = useState(payload?.id);
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useActiveUserInfo(payload?.id, token);
  const [initialDomicilioValue, setInitialDomiciloValue] = useState(0);
  const [domicilio, setDomicilio] = useState(0);
  const [showFullQr, setShowFullQr] = useState(false);
  const handleChangeAddress = (e) => {
    setLugarEntrega(e.target.value);
  };
  const addressToggle = () => {
    setAddress(!address);
  };
  const qrToggle = () => {
    setShowFullQr(!showFullQr);
  };
  const handleAddressSubmit = async (data) => {
    setLoading(true);
    setAddress(false);
    const direccionString = `${data.tipoCalle} ${data.calle} ${data.numero1}${data.numero2} ${data.infoAdicional},${data.ciudad}`;
    axios
      .put(
        `${URL_BACK}/usuarios/updateUser/${payload?.id}`,
        { direccion: direccionString },
        { headers: { "x-token": token } }
      )
      .then(() => {
        toast.success("Dirección agregada con éxito! ", {
          autoClose: 800,
          toastId: "direccion-ok",
        });
        axios
          .get(`${URL_BACK}/usuarios/getUserById/${payload?.id}`, {
            headers: { "x-token": token },
          })
          .then((res) => {
            setUserData(res.data);
            setDomicilio(15000);
          });
      })
      .catch(() => {
        toast.error("Error al añadir dirección! ", {
          autoClose: 800,
          toastId: "direccion-mal",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const calcularDomicilioTodosPedidos = async () => {
      const getMunicipioFromDireccion = userData.direccion.split(",");
      const findMunicipio = municipios.find(
        (domicilio) =>
          domicilio.nombre ==
          getMunicipioFromDireccion[getMunicipioFromDireccion.length - 1]
      );
      const response = await calcularDomicilio(userData?.id, {
        valorDomicilio: findMunicipio.precio,
      });
      if (response.status === 201)
        setInitialDomiciloValue(response.data.valorFinal);
    };
    if (userData?.direccion) {
      calcularDomicilioTodosPedidos();
    } else {
      setDomicilio(0);
    }
  }, [userData]);

  useEffect(() => {
    if (lugarEntrega === userData?.direccion)
      return setDomicilio(initialDomicilioValue);
    setDomicilio(0);
  }, [lugarEntrega, subtotal, domicilio]);
  const [total, setTotal] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    watch: watchComprobante,
    formState: { errors: errorsForm2 },
  } = useForm();

  useEffect(() => {
    if (isFirstRender) return;
    if (!errorsForm2) return;
    if (errorsForm2.file?.type === "required") {
      toast.error("Ingresa la imagen con la transferencia!", {
        toastId: "transferenciaImagen",
        autoClose: 600,
      });
    }
    if (errorsForm2.file?.type === "validate") {
      toast.error("Solo se permiten imágenes!", {
        toastId: "transferenciaImagenError",
        autoClose: 600,
      });
    }
  }, [errorsForm2.file]);

  const isAnImage = (extension) => {
    return imageExtensions.includes(extension);
  };
  const handleTransferencia = async (data) => {
    setNombreComprobante(data.nombreComprobante);
    setImagen(data.file[0]);
    qrToggle();
    toast.success("Comprobante añadido con éxito!", { autoClose: 1500 });
  };
  const isCheckedChangeName = watchComprobante("incluirNombreComprobante");
  useEffect(() => {
    (!token || cartData.length == 0) && navigate("/");
  }, [token, cartData, navigate]);

  const handlePassPayMethod = () => {
    if (lugarEntrega === userData?.direccion && !userData?.direccion) {
      setAddress(true);
      return;
    }
    if (lugarEntrega !== userData?.direccion && lugarEntrega !== "modisteria")
      return;
    setElegirPago(true);
  };
  const handleAddCotizacion = async () => {
    if (!file) {
      qrToggle();
      return;
    }
    const formDataAdd = new FormData();
    const ids = cartData.map((value) => value.id);
    formDataAdd.append("nombrePersona", nombreComprobante);
    formDataAdd.append("valorDomicilio", domicilio);
    formDataAdd.append("valorPrendas", subtotal);
    formDataAdd.append("lugarEntrega", lugarEntrega);
    formDataAdd.append("pedidoId", ids);
    formDataAdd.append("file", file);

    const response = await triggerFetch(
      `${URL_BACK}/ventas/createVenta`,
      "POST",
      formDataAdd,
      {
        "x-token": token,
      }
    );
    if (response.status === 201)
      toast.success(`${response.data.msg}\nEspera tu correo de confirmación`, {
        autoClose: 3000,
        onClose: () => navigate("/"),
      });
    else if (response.status === 400) {
      toast.error(`${response.data.error}`, {
        autoClose: 2000,
      });
    }
  };
  console.log(cartData);

  return (
    <>
      <Metadata title={"Venta - Modisteria Doña Luz"}></Metadata>
      {loading && <Loading></Loading>}
      {loadingFetch && <Loading></Loading>}
      <br />
      <br />
      <section className="venta-section">
        <article className={`recogida ${elegirPago ? "" : "activo"}`}>
          <h2>Elige la forma de entrega</h2>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  className="radio-styles"
                  name="entrega"
                  value={userData?.direccion}
                  onChange={handleChangeAddress}
                  checked={lugarEntrega === userData?.direccion}
                />
                <span className="input-text">Enviar a domicilio</span>
              </div>
              {userData?.direccion ? (
                <h4 className="info-adicional">{userData?.direccion}</h4>
              ) : (
                <h4 onClick={addressToggle} className="info-agregar-direccion">
                  Agregar dirección
                </h4>
              )}
            </div>
            <div className="price-choice">
              {userData?.direccion ? (
                <span>{formToCop(domicilio)}</span>
              ) : (
                <span>Por definir</span>
              )}
            </div>
          </label>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  onChange={handleChangeAddress}
                  className="radio-styles"
                  name="entrega"
                  value="modisteria"
                  checked={lugarEntrega === "modisteria"}
                />
                <span className="input-text">Recoger en la Modisteria</span>
              </div>
              <h4 className="info-adicional">
                Calle 43 #34 - 195 int 306 - Copacabana
              </h4>
            </div>
            <div className="price-choice">
              <span>Sin costo</span>
            </div>
          </label>
          <button onClick={handlePassPayMethod} className="boton-continuar">
            Continuar
          </button>
        </article>
        <article className={`recogida ${elegirPago ? "activo" : ""}`}>
          <div className="titleElegirpPago">
            <KeyboardDoubleArrowLeftIcon
              className="icon-large"
              sx={{ fontSize: "50px" }}
              onClick={() => setElegirPago(false)}
            ></KeyboardDoubleArrowLeftIcon>
            <h2>Proceso de pago</h2>
          </div>
          <label className="card-option">
            <div className="choice">
              <div>
                <input
                  type="radio"
                  className="radio-styles"
                  name="pago"
                  value="transferencia"
                  checked={true}
                />
                <span className="input-text">Pagar por transferencia</span>
              </div>
              <div className="tipos-transferencia">
                <img
                  alt="bancolombia logo"
                  title="Bancolombia"
                  src="https://seeklogo.com/images/B/bancolombia-logo-932DD4816B-seeklogo.com.png"
                />
                <img
                  src="https://static.wixstatic.com/media/60a29b_ff944fc332d24bf9b7e861543c9d9854~mv2.png/v1/fill/w_318,h_318,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/nequi-logo.png"
                  alt="nequi logo"
                  title="Nequi"
                />
              </div>
            </div>
            <div className="price-choice">
              <span>
                <img
                  className="qr-img"
                  onClick={qrToggle}
                  src="https://static.vecteezy.com/system/resources/previews/013/722/213/non_2x/sample-qr-code-icon-png.png"
                  alt="qr"
                  title="Qr Doña Luz"
                />
              </span>
            </div>
          </label>
          <button onClick={handleAddCotizacion} className="boton-continuar">
            Continuar
          </button>
        </article>
        <article className="ficha-tecnica">
          <div>
            {" "}
            <h3 className="resumen-compra-title">Resumen de mi compra</h3>
            <hr className="separacion-resumen" />
          </div>
          <div className="ficha-productos">
            {cartData.map((value) => (
              <div key={value.idPedido} className="ficha-producto">
                <div>
                  <span>⦿&nbsp;&nbsp;</span>"{value?.catalogo.producto}"{" "}
                  <span style={{ marginLeft: "5px" }}>Talla</span>
                  <span className="talla-producto">{value.Talla.nombre}</span>
                </div>
                <div>
                  <span style={{ marginRight: "4px" }}>
                    {formToCop(value.valorUnitario)}
                  </span>
                  x<span style={{ marginLeft: "4px" }}>{value.cantidad}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="info-ficha-tecnica">
            <div className="info-price-ficha-tecnica">
              {" "}
              <span>Domicilio:</span>
              <span>{formToCop(domicilio)} COP</span>
            </div>
            <div className="info-price-ficha-tecnica">
              <span>Total:</span>
              <span>{total ? formToCop(total) : formToCop(subtotal)} COP</span>
            </div>
          </div>
        </article>
      </section>
      <Modal customWidth={"800px"} onClose={addressToggle} show={address}>
        <form onSubmit={handleSubmit(handleAddressSubmit)}>
          <h2 className="add-address-title">Agregar dirección 📍</h2>
          <div className="address-modal">
            <div className="addressLeft">
              <label className="label-number-address">
                <h3 className="text-label">Tipo de Calle</h3>
                <br />
                <div className="select-container">
                  <select
                    {...register("tipoCalle", { required: true })}
                    defaultValue={"Carrera"}
                    className="select"
                  >
                    <option value="Avenida">Avenida</option>
                    <option value="Calle">Calle</option>
                    <option value="Carrera">Carrera</option>
                    <option value="Diagonal">Diagonal</option>
                    <option value="Circular">Circular</option>
                    <option value="Circunvalar">Circunvalar</option>
                    <option value="Transversal">Transversal</option>
                    <option value="Vía">Vía</option>
                  </select>
                </div>
                <br />
                <Input
                  {...register("calle", {
                    maxLength: 5,
                    required: "obligado",
                    pattern: {
                      value: /^\d+[a-zA-Z]?$/,
                      message: "no está bien hecho",
                    },
                  })}
                  error={errors.calle}
                  placeholder={"Ej. 67A "}
                ></Input>
              </label>
            </div>

            <div className="addressRight">
              <label className="label-number-address">
                <h3 className="text-label">Número</h3>
                <div className="number-address">
                  {" "}
                  <Input
                    {...register("numero1", {
                      maxLength: 4,
                      required: true,
                      pattern: { value: /^#\d+/ },
                    })}
                    placeholder={"Ej. #34"}
                    width={"3rem"}
                    description={""}
                    error={errors.numero1}
                  ></Input>
                  <Input
                    placeholder={"Ej. -195"}
                    width={"3rem"}
                    {...register("numero2", {
                      maxLength: 4,
                      required: true,
                      pattern: { value: /^-\d+/ },
                    })}
                    error={errors.numero2}
                  ></Input>
                </div>
              </label>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "85px",
            }}
          >
            <div>
              <h3 className="text-label">Municipio</h3>
              <div className="select-container">
                <select
                  {...register("ciudad", { required: true })}
                  defaultValue={"Copacabana"}
                  className="select"
                >
                  {municipios.map((municipio, idx) => (
                    <option key={idx} value={municipio.nombre}>
                      {municipio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="piso-depto">
              <h3 className="text-label">Piso/Departamento (Opcional)</h3>
              <Input
                {...register("infoAdicional", {
                  maxLength: 40,
                })}
                width={"rem"}
                placeholder={"Ej. int 201 torre 2"}
                error={errors.infoAdicional}
              ></Input>
            </label>
          </div>
          <button type="submit" className="agregar-direccion">
            Agregar
          </button>
        </form>
      </Modal>

      <Modal onClose={qrToggle} show={showFullQr}>
        <form
          onSubmit={handleSubmitForm2(handleTransferencia)}
          className="modal-qr"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/013/722/213/non_2x/sample-qr-code-icon-png.png"
            alt="qr"
            title="Qr Doña Luz"
          />
          <br />
          <div className="qrcode-data">
            <div className="emisor">
              <span>¿Cambiar quien lo envía?</span>

              <div className="checkbox-wrapper-10">
                <input
                  type="checkbox"
                  id="cb5"
                  className="tgl tgl-flip"
                  {...registerForm2("incluirNombreComprobante")}
                />
                <label
                  htmlFor="cb5"
                  data-tg-on="Si"
                  data-tg-off="No"
                  className="tgl-btn"
                ></label>
              </div>
            </div>

            <Input
              {...registerForm2("nombreComprobante", {
                required: true,
                minLength: 4,
              })}
              defaultValue={payload?.nombre}
              readOnly={!isCheckedChangeName}
              error={errorsForm2.nombreComprobante}
            />
          </div>
          <div className="actions-qr">
            <label className="subir-comprobante">
              <input
                {...registerForm2("file", {
                  required: true,
                  validate: () => {
                    return isAnImage(
                      watchComprobante("file")[0].name.split(".")[1]
                    );
                  },
                })}
                type="file"
                accept="image/*"
              />
              <div>
                {"Subir"}
                <QrCode color={"#fff"} size={"24"}></QrCode>
              </div>
            </label>
            <button type="submit" className="agregar-direccion">
              Enviar Comprobante
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
