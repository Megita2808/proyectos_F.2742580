import Metadata from "../../components/metadata/Metadata";
import { useState, useEffect } from "react";
import "./perfil.css";
import fotoPerfil from "/fotoPerfil.jpg";
import {
  User,
  Phone,
  Mail,
  Rol,
  Key,
  Password,
} from "../../components/svg/Svg";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input_basico/Input";
import useDecodedJwt from "../../hooks/useJwt";
import { useJwt } from "../../context/JWTContext";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import useIsFirstRender from "../../hooks/useIsMount";
import constants, {
  formatDateSpanish,
  URL_BACK,
} from "../../assets/constants.d";
import Loading from "../../components/loading/Loading";
import CitaComponente from "../../components/CitaComponente/CitaComponente";
export default function Perfil() {
  const { token, cleanToken, saveToken } = useJwt();
  const payload = useDecodedJwt(token);
  useEffect(() => {
    if (isFirstRender) return;
    navigate("/perfil");
  }, [token]);

  const isFirstRender = useIsFirstRender();
  const navigate = useNavigate();
  const [passwordAttempts, setPasswordAttemps] = useState(4);
  const [myAppointments, setMyAppointments] = useState();
  const [typeAppointment, setTypeAppointment] = useState("9");
  const [lastSale, setLastSale] = useState(false);
  const { triggerFetch: fetchIsYourPass } = useFetch();
  const { triggerFetch: fetchChangePass } = useFetch();
  console.log(lastSale);
  const { triggerFetch: fetchYourAppointments, loading: loadingAppointments } =
    useFetch();
  const { triggerFetch: fetchYourLastSale, loading: loadingLastSle } =
    useFetch();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const onChangeTypeAppointment = (e) => {
    setTypeAppointment(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchYourLastSale(
        `${URL_BACK}/ventas/getVentaByUsuarioId/${payload?.id}`,
        "GET",
        null,
        { "x-token": token }
      );
      if (!Array.isArray(response.data)) return;
      setLastSale([response.data[0]]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchYourAppointments(
        `${URL_BACK}/citas/getCitaByUserId/${payload?.id}${
          typeAppointment !== null
            ? `?estadoId=${typeAppointment}`
            : "?estadoId=9"
        }`,
        "GET",
        null,
        { "x-token": token }
      );
      setMyAppointments(response.data);
    };
    fetchData();
  }, [typeAppointment]);

  const [showModal4, setShowModal4] = useState(false);
  const toggleModal4 = () => {
    setShowModal4(!showModal4);
  };

  const [showModal5, setShowModal5] = useState(false);
  const toggleModal5 = () => {
    setShowModal5(!showModal5);
  };
  const colombianPhone = () => {
    return constants.PHONE_REGEX.test(watch("telefono"));
  };
  useEffect(() => {
    if (isFirstRender) return;
    if (passwordAttempts === 4) return;
    if (passwordAttempts > 1) {
      toast.error(
        `Contraseña incorrecta. Quedan ${passwordAttempts} intentos`,
        { autoClose: 700 }
      );
      return;
    } else if (passwordAttempts === 1) {
      toast.error(`Contraseña incorrecta. Queda 1 intento`, { autoClose: 700 });
      return;
    } else {
      toast.error("Demasiados intentos fallidos. Cerrando sesión!", {
        toastId: "closeSession",
        autoClose: 700,
        onClose: () => {
          navigate("/");
          cleanToken();
        },
      });
      return;
    }
  }, [passwordAttempts]);
  const handleFirstPasswordSubmit = async (data) => {
    const response = await fetchIsYourPass(
      `${URL_BACK}/usuarios/isYourCurrentPassword`,
      "POST",
      { email: payload?.email, password: data.contraseniaActual }
    );
    if (response && response.data.isYourCurrentPassword) {
      setPasswordAttemps(4);
      toast.success("Contraseña correcta! 😊", {
        autoClose: 700,
        onClose: () => {
          toggleModal4();
          toggleModal5();
        },
      });
    } else {
      setPasswordAttemps((prev) => prev - 1);
    }
  };

  const handleNewPasswordSubmitLogic = async (data) => {
    const response = await fetchChangePass(
      `${URL_BACK}/usuarios/resetCurrentPassword`,
      "POST",
      { email: payload?.email, newPassword: data.nuevaContrasenia },
      { "x-token": token }
    );

    response.status !== 200
      ? toast.error(response.data.msg, { autoClose: 700 })
      : toast.success(response.data.msg, {
          autoClose: 700,
          onClose: () => {
            toggleModal5();
          },
        });
  };
  const handleUpdateInfoLogic = async (data) => {
    const response = await fetchChangePass(
      `${URL_BACK}/usuarios/updateInfo/${payload?.id}`,
      "PUT",
      { nombre: data.nombre, telefono: data.telefono },
      { "x-token": token }
    );
    response.status !== 201
      ? toast.error(response.data.msg, { autoClose: 700 })
      : toast.success(response.data.msg, {
          autoClose: 700,
          onClose: () => {
            toggleModal();
            saveToken(response.data.token);
          },
        });
  };

  const {
    handleSubmit: handlePasswordSubmit,
    register: registerPasswords,
    formState: { errors: errorsPassword },
  } = useForm();
  const {
    handleSubmit: handleNewPasswordSubmit,
    register: registerNewPasswords,
    formState: { errors: errorsNewPasswords },
    watch: watchNewPasswords,
  } = useForm();
  const { register, watch, handleSubmit: handleUpdateInfo } = useForm();

  return (
    <>
      <Metadata title={"Perfil - Modistería Doña Luz"}></Metadata>
      {loadingAppointments && <Loading></Loading>}
      {!token && <Navigate to={"/"} replace={true} />}
      <div className="titulo">
        <h1>Mi Perfil</h1>
        <hr />
      </div>

      <section className="miPerfil">
        <div className="contenedorPerfil">
          <div>
            <div className="info1">
              <div className="imgNombre">
                <img src={fotoPerfil} alt="" className="fotoPerfil" />
                <br />
                <span>{payload?.nombre}</span>
              </div>
              <span>
                <span className="subtitulo">
                  <Rol></Rol>&nbsp;&nbsp;Rol:
                </span>{" "}
                {payload?.role.nombre}
              </span>
            </div>
            <div className="change-tipo-cita">
              <span>Filtrar cita</span>

              <div className="radio-input-wrapper">
                <label className="labelRadio">
                  <input
                    value="9"
                    name="tipoCita"
                    id="por-cotizar"
                    className="radio-input"
                    type="radio"
                    defaultChecked
                    onChange={onChangeTypeAppointment}
                  />
                  <div className="radio-design"></div>
                  <div className="radio-text">Por cotizar</div>
                </label>

                <label className="labelRadio">
                  <input
                    value="10"
                    name="tipoCita"
                    id="cotizada"
                    className="radio-input"
                    type="radio"
                    onChange={onChangeTypeAppointment}
                  />
                  <div className="radio-design"></div>
                  <div className="radio-text">Cotizada</div>
                </label>

                <label className="labelRadio">
                  <input
                    value="11"
                    name="tipoCita"
                    id="aceptada"
                    className="radio-input"
                    type="radio"
                    onChange={onChangeTypeAppointment}
                  />
                  <div className="radio-design"></div>
                  <div className="radio-text">Aceptada</div>
                </label>

                <label className="labelRadio">
                  <input
                    value="12"
                    name="tipoCita"
                    id="cancelada"
                    className="radio-input"
                    type="radio"
                    onChange={onChangeTypeAppointment}
                  />
                  <div className="radio-design"></div>
                  <div className="radio-text">Cancelada</div>
                </label>

                <label className="labelRadio">
                  <input
                    value="13"
                    name="tipoCita"
                    id="terminada"
                    className="radio-input"
                    type="radio"
                    onChange={onChangeTypeAppointment}
                  />
                  <div className="radio-design"></div>
                  <div className="radio-text">Terminada</div>
                </label>
              </div>
            </div>
            {lastSale && <div className="ultimaVenta"></div>}
          </div>

          <div className="info2">
            <div className="infoGeneral">
              <div className="encabezado">
                <span>Información General</span>

                <button className="editInfo" onClick={toggleModal}>
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
              </div>

              <table>
                <tr>
                  <th>
                    <User></User>&nbsp;&nbsp;Nombre
                  </th>
                  <td>:</td>
                  <td>{payload?.nombre}</td>
                </tr>
                <tr>
                  <th>
                    <Phone></Phone>&nbsp;&nbsp;Telefono
                  </th>
                  <td>:</td>
                  <td>{payload?.telefono}</td>
                </tr>
                <tr>
                  <th>
                    <Mail></Mail>&nbsp;&nbsp;Correo
                  </th>
                  <td>:</td>
                  <td>{payload?.email}</td>
                </tr>
                <tr>
                  <th>
                    <Password size={"20px"}></Password>&nbsp;&nbsp;Password
                  </th>
                  <td>:</td>
                  <td>
                    <button className="editInfo" onClick={toggleModal4}>
                      <svg className="edit-svgIcon" viewBox="0 0 512 512">
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>

                <Modal show={showModal4} onClose={toggleModal4}>
                  <form
                    onSubmit={handlePasswordSubmit(handleFirstPasswordSubmit)}
                    className="modalCambiarPassword"
                  >
                    <span>Validar Contraseña</span>
                    <div className="bodyCambiarPassword">
                      <span>Ingresa tu contraseña actual</span>
                      <Input
                        {...registerPasswords("contraseniaActual", {
                          minLength: 8,
                          required: true,
                        })}
                        type={"password"}
                        placeholder={"Contraseña actual"}
                        canHidden
                        description={
                          errorsPassword.contraseniaActual &&
                          "Mínimo 8 caracteres"
                        }
                        color={"#f00"}
                        error={errorsPassword.contraseniaActual}
                      ></Input>

                      <button className="btnCancelarCita" type="submit">
                        <span>Validar</span>
                      </button>
                    </div>
                  </form>
                </Modal>

                <Modal show={showModal5} onClose={toggleModal5}>
                  <form
                    onSubmit={handleNewPasswordSubmit(
                      handleNewPasswordSubmitLogic
                    )}
                    className="modalActualizar"
                  >
                    <span className="modalActualizarTitle">
                      Cambiar Contraseña
                    </span>
                    <Input
                      {...registerNewPasswords("nuevaContrasenia", {
                        required: true,
                        minLength: 8,
                      })}
                      type={"password"}
                      placeholder={"Nueva Contraseña"}
                      canHidden
                      description={
                        errorsNewPasswords.nuevaContrasenia &&
                        "Mínimo 8 caracteres"
                      }
                      color={"#f00"}
                      error={errorsNewPasswords.nuevaContrasenia}
                    ></Input>
                    <Input
                      {...registerNewPasswords("repetirNuevaContrasenia", {
                        required: true,
                        validate: () => {
                          return (
                            watchNewPasswords("nuevaContrasenia") ===
                            watchNewPasswords("repetirNuevaContrasenia")
                          );
                        },
                      })}
                      type={"password"}
                      placeholder={"Confirmar Contraseña"}
                      canHidden
                      description={
                        errorsNewPasswords.repetirNuevaContrasenia &&
                        "Las contraseñas no coinciden"
                      }
                      color={"#f00"}
                      error={errorsNewPasswords.repetirNuevaContrasenia}
                    ></Input>

                    <button className="btnCancelarCita">
                      <span>Actualizar</span>
                    </button>
                  </form>
                </Modal>
              </table>
            </div>

            <Modal show={showModal} onClose={toggleModal}>
              <form
                onSubmit={handleUpdateInfo(handleUpdateInfoLogic)}
                className="modal-headerEditar"
              >
                <span className="subtituloEditar">Edición de Información</span>
                <Input
                  type={"text"}
                  {...register("nombre", { required: true, minLength: 4 })}
                  description={
                    watch("nombre")?.length > 0
                      ? "Debe tener al menos 4 caracteres"
                      : ""
                  }
                  placeholder={payload?.nombre}
                  color={watch("nombre")?.length < 4 ? "#f00" : "#000"}
                ></Input>
                <Input
                  type={"text"}
                  {...register("telefono", {
                    validate: colombianPhone,
                    maxLength: 10,
                  })}
                  color={colombianPhone() ? "#000" : "#f00"}
                  description={
                    watch("telefono")?.length > 0
                      ? "Ingrese un número válido (+57)"
                      : ""
                  }
                  placeholder={payload?.telefono}
                ></Input>

                <button className="btnCancelarCita">
                  <span>Actualizar</span>
                </button>
              </form>
            </Modal>
            <div className="misCitas">
              <span className="subtituloCitas"></span>
              {myAppointments?.length >= 1 ? (
                myAppointments.map((value) => (
                  <CitaComponente
                    typeAppointment={typeAppointment}
                    token={token}
                    key={value.id}
                    value={value}
                  />
                ))
              ) : (
                <div
                  className="cartas-sin-citas
                "
                >
                  <h1>Mis Citas</h1>
                  <h4>
                    No cuentas con ninguna cita asociada este tipo.{" "}
                    <span
                      onClick={() => {
                        navigate("/cita");
                      }}
                      className="agendar-cita-boton-no-cita"
                    >
                      Agendar cita
                    </span>
                  </h4>
                </div>
              )}
            </div>
            <div className="misDomicilios" style={{ color: "#000" }}>
              <span></span>
            </div>
            {/* {lastSale &&
              lastSale.map((cita) => (
                <div key={cita.id} class="misVentas">
                  <div class="fechaFactura">
                    Fecha: {formatDateSpanish(cita.fecha)}
                  </div>
                  <div class="nombreFactura">
                    <h4>
                      Nombre del Cliente:{" "}
                      <span>{cita.nombrePersona}</span>
                    </h4>
                  </div>
                  <div class="productosFactura">
                    {cita?..map((pedido, idx) => (
                      <div class="producto">
                        <h4>Producto {idx + 1}</h4>
                        <p>Cantidad: {pedido.pedido.cantidad}</p>
                        <p>Precio: ${pedido.pedido.precioFinal}</p>
                      </div>
                    ))}
                  </div>
                  <div class="valoresFactura">
                    <p>
                      Valor del Domicilio: ${cita.cotizacion.valorDomicilio}
                    </p>
                    <p>Valor de las Prendas: ${cita.cotizacion.valorPrendas}</p>
                    <p>Total: ${cita.cotizacion.valorFinal}</p>
                  </div>
                </div>
              ))} */}
          </div>
        </div>
      </section>
      <ToastContainer></ToastContainer>
    </>
  );
}
