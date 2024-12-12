import { useState } from "react";
import {
  formatDateSpanish,
  formaTime,
  imageExtensions,
  URL_BACK,
} from "../../assets/constants.d";
import { Cancel, Alert } from "../svg/Svg";
import Modal from "../../components/modal/Modal";
import Loading from "../../components/loading/Loading";
import useFetch from "../../hooks/useFetch";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../components/input_basico/Input";
import useDecodedJwt from "../../hooks/useJwt";
import { QrCode } from "../../components/svg/Svg";
import dayjs from "dayjs";

export default function CitaComponente({ value, typeAppointment, token }) {
  const payload = useDecodedJwt(token);
  const [showModal2, setShowModal2] = useState(false);
  const toggleModal2 = () => {
    setShowModal2(!showModal2);
  };
  const navigate = useNavigate();
  const { triggerFetch: cancelarCita } = useFetch();
  const { triggerFetch: aceptarCita } = useFetch();
  const [showModal3, setShowModal3] = useState(false);
  const [showFullQr, setShowFullQr] = useState(false);
  const [nombreComprobante, setNombreComprobante] = useState(payload?.id);
  const [imagen, setImagen] = useState(null);

  const isAnImage = (extension) => {
    return imageExtensions.includes(extension);
  };
  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    watch: watchComprobante,
    formState: { errors: errorsForm2 },
  } = useForm();

  const isCheckedChangeName = watchComprobante("incluirNombreComprobante");

  const toggleModal3 = () => {
    setShowModal3(!showModal3);
  };
  const qrToggle = () => {
    setShowFullQr(!showFullQr);
  };

  const handleCancelarCitaCliente = async () => {
    const response = await cancelarCita(
      `${URL_BACK}/citas/cancelarCita/${value.id}`,
      "PUT",
      null,
      { "x-token": token }
    );
    console.log(response.data);
    console.log(response.data.message);
    if (response.status === 400) {
      toast.error(`${response.data.message}!`, {
        toastId: "errorDeleteCita",
        autoClose: 1500,
      });
    } else if (response.status === 201 || response.status === 200) {
      toggleModal3();
      toast.success(`${response.data.msg} con éxito!`, {
        toastId: "DeleteCita",
        autoClose: 1500,
        onClose: () => toggleModal2(),
      });
    }
  };

  const handleTransferencia = async (data) => {
    try {
      setNombreComprobante(data.nombreComprobante);

      if (!data.file || data.file.length === 0) {
        toast.error("Por favor, adjunta una imagen válida.");
        return;
      }

      const file = data.file[0];
      setImagen(file);

      toast.success("Comprobante añadido con éxito!", {
        autoClose: 1500,
      });

      await handleConfirmarCita({ ...data, file: file });
    } catch (error) {
      console.error("Error en handleTransferencia:", error);
      toast.error("Ocurrió un error durante la transferencia.");
    }
  };

  const handleConfirmarCita = async (data) => {
    const formData = new FormData();

    // Agregar archivo e información adicional al FormData
    if (data.file) {
      formData.append("file", data.file);
    } else {
      toast.error("Por favor, adjunta una imagen válida.");
      return;
    }

    if (data.nombreComprobante) {
      formData.append("nombrePersona", data.nombreComprobante);
    } else {
      toast.error("El nombre de la persona es necesario.");
      return;
    }

    try {
      const response = await aceptarCita(
        `${URL_BACK}/citas/aceptarCita/${value.id}`,
        "PUT",
        formData,
        {
          "x-token": token,
        }
      );

      if (response.status === 400) {
        toast.error(`${response.data.message}!`, {
          toastId: "errorConfirmarCita",
          autoClose: 1500,
        });
      } else if (response.status === 201 || response.status === 200) {
        qrToggle();
        toast.success(`${response.data.msg} con éxito!`, {
          toastId: "confirmarCita",
          autoClose: 1500,
          onClose: () => qrToggle(),
        });
      }
    } catch (error) {
      console.error("Error al confirmar la cita:", error);
      toast.error("Ocurrió un error al confirmar la cita", {
        toastId: "errorConfirmarCitaGeneral",
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      <div key={value.id} className="cartasCitas">
        <div className="carta work">
          <div className="img-section">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              transform="rotate(45)"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-month"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M4 11h16" />
              <path d="M7 14h.013" />
              <path d="M10.01 14h.005" />
              <path d="M13.01 14h.005" />
              <path d="M16.015 14h.005" />
              <path d="M13.015 17h.005" />
              <path d="M7.01 17h.005" />
              <path d="M10.01 17h.005" />
            </svg>{" "}
          </div>
          <div className="carta-desc">
            <div className="carta-header">
              <div className="carta-title">Cita</div>
              {typeAppointment === "9" || typeAppointment === "10"}
              <button className="carta-menu" onClick={toggleModal2}>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </button>
            </div>
            <div className="carta-time">
              {dayjs(value.fecha).format(
                          "hh[:]mm A"
                        )}
              <br />
              <p>{value.objetivo}</p>
            </div>
            <p className="recent">{formatDateSpanish(value.fecha)}</p>
          </div>
        </div>
        {typeAppointment === "9" && (
          <Modal show={showModal2} onClose={toggleModal2}>
            <div className="modal-header">
              <Cancel color={"rgb(187, 25, 25)"} size={"150px"}></Cancel>
              <br />
              <span>
                ¿Deseas cancelar la cita del {formatDateSpanish(value.fecha)}?
              </span>
              <button
                className="btnCancelarCita"
                onClick={() => {
                  toggleModal2();
                  toggleModal3();
                }}
              >
                <span>Continuar</span>
              </button>
            </div>
          </Modal>
        )}

        {/*MODAL DE CONFIRMACIÓN*/}
        {typeAppointment === "9" && (
          <Modal show={showModal3} onClose={toggleModal3}>
            <div className="modalConfirmar">
              <Alert size={"150px"} color={"rgb(187, 25, 25)"}></Alert> <br />
              <span>¿Estás seguro de cancelar tu cita con la modista?</span>
              <br />
              <span>Aún no se ha realizado la cotización</span>
              <div>
                <button
                  className="btnCancelarCita"
                  onClick={() => {
                    toggleModal3();
                  }}
                >
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleCancelarCitaCliente}
                  className="btnCancelarCita"
                >
                  <span>Confirmar</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
        {typeAppointment === "10" && (
          <Modal show={showModal2} onClose={toggleModal2}>
            <div className="modalConfirmar">
              <Alert size={"150px"} color={"rgb(187, 25, 25)"}></Alert> <br />
              <span>Información sobre la cita</span>
              <br />
              <span>Tiempo estimado: {value.tiempo}</span>
              <br />
              <span>Precio del producto: ${value.precio}</span>
              <br />
              <button
                className="btnCancelarCita"
                onClick={() => {
                  toggleModal2();
                  qrToggle();
                }}
              >
                <span>Confirmar</span>
              </button>
              <button
                className="btnCancelarCita"
                onClick={handleCancelarCitaCliente}
              >
                <span>Cancelar</span>
              </button>
            </div>
          </Modal>
        )}

        {/* Nueva modal para adjuntar la imagen */}
        <Modal customWidth={"400px"} onClose={qrToggle} show={showFullQr}>
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
      </div>
      <ToastContainer />
    </>
  );
}
