import Metadata from "../../components/metadata/Metadata";
import "./register.css";
import foto from "/foto1.jfif";
import { useForm } from "react-hook-form";
import Input from "../../components/input_basico/Input";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constants, { URL_BACK } from "../../assets/constants.d";
import axios from "axios";
import Loading from "../../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import OTP from "../../components/input_otp/Otp";
import { useJwt } from "../../context/JWTContext";
export default function Register() {
  // REACT HOOK FORM
  const { register, handleSubmit, watch, setFocus } = useForm();
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [otpCode, setOtpCode] = useState(null);
  const toggleModalVerifyEmail = () => {
    setShowVerifyEmail(!showVerifyEmail);
  };
  const navigate = useNavigate();
  //PONER EL FOCO AL INICIAR LA PÁGINA AL NOMBRE
  useEffect(() => {
    setFocus("nombre");
  }, [setFocus]);

  const { token } = useJwt();
  useEffect(() => {
    token && navigate("/");
  }, [token]);

  const onChangeOTP = (otpArray) => {
    setOtpCode(otpArray.join(""));
  };
  const handleVerifyMailCode = async () => {
    if (otpCode.length !== 6) return;
    axios
      .post(
        `${URL_BACK}/usuarios/verifyUser`,
        {
          nombre: registerData.nombre,
          codigo: parseInt(otpCode),
          email: registerData.correo,
          telefono: registerData.telefono,
          password: registerData.contrasenia,
          roleId: 1,
          estadoId: 1,
        }
      )
      .then((response) => {
        toggleModalVerifyEmail();
        toast.success(`${response.data.msg}`, {
          position: "top-right",
          toastId: "success-toast-fetch-register",
          autoClose: 800,
          onClose: () => {
            navigate("/sesion");
          },
        });
      })

      .catch((error) => {
        toast.error(`${error.response.data.msg}!`, {
          position: "top-right",
          toastId: "error-toast-fetch-register",
          autoClose: 1000,
        });
      });
  };
  // MANEJO DEL ENVÍO FORMULARIO
  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    axios
      .post(
        `${URL_BACK}/usuarios/createUser`,
        {
          email: data.correo,
        }
      )
      .then((response) => {
        toast.success(`${response.data.msg}`, {
          position: "top-right",
          toastId: "success-toast-fetch-register",
          autoClose: 800,
          onClose: () => {
            toggleModalVerifyEmail();
          },
        });
        setRegisterData(data);
      })

      .catch((error) => {
        toast.error(`${error.response.data.msg}!`, {
          position: "top-right",
          toastId: "error-toast-fetch-register",
          autoClose: 1000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //VALIDATION
  const colombianPhone = () => {
    return constants.PHONE_REGEX.test(watch("telefono"));
  };
  const mailValidation = () => {
    return constants.EMAIL_REGEX.test(watch("correo"));
  };
  const samePass = () => {
    return watch("contrasenia") === watch("repetirContrasenia");
  };
  const minPassword = watch("contrasenia")?.length < 8 ? "#f00" : "#000";
  const minUserName = watch("nombre")?.length < 4 ? "#f00" : "#000";
  return (
    <>
      {loading && <Loading></Loading>}
      <Metadata title={"Registro - Modistería Doña Luz"}></Metadata>
      <br />
      <br />
      <span className="black">Regis</span>
      <span className="black">trate</span>
      <hr className="separacionRegistro" />
      <br />

      <div className="contenedor">
        <div className="imagen">
          <img src={foto} alt="" className="imagenForm" />
        </div>
        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type={"text"}
              {...register("nombre", { required: true, minLength: 4 })}
              description={
                watch("nombre")?.length > 0
                  ? "Debe tener al menos 4 caracteres"
                  : ""
              }
              placeholder={"Nombres:"}
              color={minUserName}
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
                  ? "Ingrese un número válido (+57 Colombiano)"
                  : ""
              }
              placeholder={"Télefono:"}
            ></Input>
            <Input
              type={"text"}
              {...register("correo", {
                validate: mailValidation,
              })}
              description={
                watch("correo")?.length > 0 ? "Ingrese un correo válido" : ""
              }
              placeholder={"Correo:"}
              color={mailValidation() ? "#000" : "#f00"}
            ></Input>
            <Input
              {...register("contrasenia", { required: true, minLength: 8 })}
              description={
                watch("contrasenia")?.length > 0
                  ? "Debe tener al menos 8 caracteres"
                  : ""
              }
              placeholder={"Contraseña:"}
              color={minPassword}
              canHidden
            ></Input>
            <Input
              {...register("repetirContrasenia", {
                validate: samePass,
              })}
              description={
                watch("repetirContrasenia")?.length > 0
                  ? "Las contraseñas deben coincidir"
                  : ""
              }
              placeholder={"Repetir contraseña"}
              color={samePass() ? "#000" : "#f00"}
              canHidden
            ></Input>
            <button className="btn-registro">
              <span>Registrarme</span>
            </button>
          </form><br />
          <span className="yaCuenta">¿Ya tienes una cuenta? <a href="sesion">Inicia Sesión</a></span>
        </div>
      </div>
      <Modal
        show={showVerifyEmail}
        onClose={toggleModalVerifyEmail}
        className="modalPass"
      >
        <h2>Ingresa el Código</h2>
        <div className="inputModal">
          <OTP numInputs={6} onChange={onChangeOTP}></OTP>
          <div>Revisa la bandeja de entrada de tu correo</div>
        </div>

        <button className="btn-registroSesion" onClick={handleVerifyMailCode}>
          <span>Verificar Código</span>
        </button>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
