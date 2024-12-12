import "./sesion.css";
import { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import foto2 from "/foto2.jfif";
import Input from "../../components/input_basico/Input";
import Metadata from "../../components/metadata/Metadata";
import OTP from "../../components/input_otp/Otp";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import constants, { URL_BACK } from "../../assets/constants.d";
import axios from "axios";
import Loading from "../../components/loading/Loading";
import useModals from "../../hooks/useSessionModals";
import { useJwt } from "../../context/JWTContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
export default function InicioSesion() {
  const { token, saveToken } = useJwt();
  const navigate = useNavigate();
  const { fetchCartData } = useCart();
  useEffect(() => {
    token && navigate("/");
  }, [token]);
  useEffect(() => {
    setLoading((prev) => !prev);
    setTimeout(() => {
      setLoading((prev) => !prev);
    }, 400);
  }, []);
  const {
    handleSubmit: handleSubmit1,
    watch: watch,
    register: register1,
    setFocus,
  } = useForm();
  const { watch: watch2, register: register2 } = useForm();
  const [otpCode, setOtpCode] = useState("");
  //FORM
  const [loading, setLoading] = useState(null);
  const {
    showModal,
    showModal2,
    showModal3,
    toggleModal,
    toggleModal2,
    toggleModal3,
    handleSendCode,
    changeMail,
    handleVerifyCode,
    handleChangePass,
  } = useModals(
    constants.EMAIL_REGEX.test(watch2("recoveryMail")),
    watch2("recoveryMail"),
    otpCode,
    watch2("newPassword"),
    watch2("confirmNewPassword")
  );
  const onSubmit = async (data) => {
    if (data.email === "") {
      setFocus("email");
      return;
    }
    if (data.password === "") {
      setFocus("password");
      return;
    }
    setLoading(true);
    axios
      .post(
        `${URL_BACK}/usuarios/login`,
        {
          email: data.email,
          password: data.password,
        }
      )
      .then((response) => {
        toast.success("Sesión iniciada correctamente!", {
          toastId: "success-toast-fetch-api",
          autoClose: 1000,
          onClose: () => {
            navigate("/");
            fetchCartData();
          },
        });
        saveToken(response.data.token);
      })
      .catch(() => {
        toast.error("email y/o contraseña incorrecto/s", {
          toastId: "toast-error-fetch-id",
          autoClose: 1000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //OTP
  const onChangeOTP = (newOTP) => {
    setOtpCode(newOTP.join(""));
  };

  return (
    <>
      {loading && <Loading></Loading>}
      <Metadata title={"Inicio Sesión - Modistería Doña Luz"}></Metadata>
      <br />
      <br />
      <span className="blackSesion">Inicia </span>
      <span className="blackSesion">Sesión</span>
      <hr className="separacionSesion" />
      <br />

      <div className="contenedorSesion">
        <div className="formSesion">
          <form onSubmit={handleSubmit1(onSubmit)}>
            <div className="inputSesion">
              <Input
                {...register1("email", { pattern: constants.EMAIL_REGEX })}
                type={"text"}
                placeholder={"Correo"}
                description={
                  constants.EMAIL_REGEX.test(watch("email"))
                    ? "✔ Ingresa tu correo electrónico"
                    : ""
                }
              ></Input>
              <Input
                {...register1("password", { minLength: 8 })}
                type={"password"}
                placeholder={"Contraseña"}
                description={
                  watch("password")?.length >= 8
                    ? "✔ Ingresa una contraseña válida"
                    : ""
                }
                canHidden
              ></Input>
            </div>

            <button
              type="submit"
              disabled={
                watch("contrasenia")?.length < 8 &&
                !constants.EMAIL_REGEX.test(watch("correo"))
              }
              className="btn-registroSesion"
            >
              <span>Inicia Sesión</span>
            </button>
          </form><br /><br />
          <span className="noCuenta">¿Aún no tienes cuenta? <a href="registro">Registrate</a></span>
          <hr className="separacionForgot" />
          
          <button className="btnForgot" onClick={toggleModal}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="imagenSesion">
          <img src={foto2} alt="" className="imagenFormSesion" />
        </div>
      </div>
      {/* MODAL */}
      <Modal show={showModal} onClose={toggleModal} className="modalPass">
        <h2>Recupera tu Contraseña</h2>
        <div className="inputModal">
          <Input
            {...register2("recoveryMail")}
            type={"text"}
            placeholder={"Correo"}
            description={"Ingresa tu correo electrónico"}
          ></Input>
        </div>

        <button className="btn-registroSesion" onClick={handleSendCode}>
          <span>Enviar Código</span>
        </button>
      </Modal>

      {/* MODAL CÓDIGO*/}
      <Modal show={showModal2} onClose={toggleModal2} className="modalPass">
        <h2>Ingresa el Código</h2>
        <div className="inputModal">
          <OTP numInputs={6} onChange={onChangeOTP}></OTP>
          <div>
            No es tú correo?{" "}
            <span onClick={changeMail} className="link-get-back">
              cambiar correo
            </span>
          </div>
        </div>

        <button className="btn-registroSesion" onClick={handleVerifyCode}>
          <span>Verificar Código</span>
        </button>
      </Modal>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      <Modal show={showModal3} onClose={toggleModal3} className="modalPass">
        <h2>Cambiar Contraseña</h2>
        <div className="inputModalPassword">
          <Input
            type={"password"}
            {...register2("newPassword", { minLength: 8 })}
            placeholder={"Nueva Contraseña"}
            description={
              watch2("newPassword")?.length >= 8
                ? "✔ Nueva contraseña válida"
                : ""
            }
            canHidden
          />
          <Input
            type={"password"}
            {...register2("confirmNewPassword", { minLength: 8 })}
            placeholder={"Confirmar Contraseña"}
            description={
              watch2("newPassword") == watch2("confirmNewPassword")
                ? "✔ Las contraseñas coinciden"
                : ""
            }
            canHidden
          />
        </div>

        <button onClick={handleChangePass} className="btn-registroSesion">
          <span>Cambiar Contraseña</span>
        </button>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
