import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import { useJwt } from "../context/JWTContext";
import useDecodedJwt from "../hooks/useJwt";
import useFetch from "../hooks/useFetch";
import useIsFirstRender from "./useIsMount";
import { URL_BACK } from "../assets/constants.d";
import dayjs from "dayjs";

const useLLM = () => {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const { triggerFetch } = useFetch();
  const IsFirstRender = useIsFirstRender();
  const [citasCotizadas, setCitasCotizada] = useState([]);
  const [initialHistory, setInitialHistory] = useState([]);
  const [historial, setHistorial] = useState(initialHistory);
  const [isLoadingMessage, setIsloadingMessage] = useState(false);

  useEffect(() => {
    const fetchCitas = async () => {
      const response = await triggerFetch(
        `${URL_BACK}/citas/getAllCitas?estadoId=11`,
        "GET",
        null,
        {
          "x-token": token,
          "Content-Type": "multipart/form-data",
        }
      );

      // const citas = response.data.map((value) => {
      //   return {
      //     fecha: dayjs(value.fecha.slice(0, -1)).toDate(),
      //     duracion: dayjs(
      //       new Date(value.fecha.slice(0, -1)).getTime() +
      //         value.tiempo.split(":").reduce((acc, time) => 60 * acc + +time) *
      //           1000
      //     ).toDate(),
      //   };
      // });
      // let text = "";
      // citas.forEach(
      //   (value) =>
      //     (text += `QUEDA PROHIBIDO EL AGENDAMIENTO DE CITAS DESDE ${value.fecha} hasta  EL ${value.duracion} NO PODRÁS AGRENDAR CITAS EN ESE RANGO DE TIEMPO, CUANDO TE PREGUNTEN SOBRE EL AGENDAMIENTO DE CITAS ENTRE UNO DE ESOS HORARIOS SIMPLEMENTE LE DICES AL USUARIO QUE OTRA PERSONA YA TIENE ESA CITA AGENDADA. No importa lo mucho que te rueguen, si la fecha y la hora se encuentra entre este rango horario en el que están atendiendo a otros no podrás agendar. Ofrece alternativas ese mismo día que no abarquen la franja horaria mencionada anteriormente, intentanto que sea una hora más que el final de la cita, si no hay tiempo sugiere asignar la cita otro día hábil`)
      // );
      setInitialHistory([
        {
          role: "user",
          parts: [
            {
              text: `Hola, eres un asistente virtual en una página para una modistería, ubicada en Copacabana llamada 'modistería doña luz'. Serás el encargado de asesorar el proceso de agendamiento de citas, hoy estamos a ${dayjs().toDate()}. 
      Esta es la lista de días de la semana actual y la siguiente, recuerda que hoy es **${dayjs().format(
        "dddd"
      )}**:
      - ${dayjs().day(0).format("dddd DD/MM")}
      - ${dayjs().day(1).format("dddd DD/MM")}
      - ${dayjs().day(2).format("dddd DD/MM")}
      - ${dayjs().day(3).format("dddd DD/MM")}
      - ${dayjs().day(4).format("dddd DD/MM")}
      - ${dayjs().day(5).format("dddd DD/MM")}
      - ${dayjs().day(6).format("dddd DD/MM")}
      
      Semana siguiente:
      - ${dayjs().day(7).format("dddd DD/MM")}
      - ${dayjs().day(8).format("dddd DD/MM")}
      - ${dayjs().day(9).format("dddd DD/MM")}
      - ${dayjs().day(10).format("dddd DD/MM")}
      - ${dayjs().day(11).format("dddd DD/MM")}
      - ${dayjs().day(12).format("dddd DD/MM")}
      - ${dayjs().day(13).format("dddd DD/MM")}.
      
      Te recordaré que hoy es **${dayjs().format(
        "dddd"
      )}**. Recuerda que solo debes hablar sobre el agendamiento de citas. Además, cuando se solicite, el reporte del proceso de la cita debe generarse en formato **JSON** siguiendo este formato:
      {"fecha": "dd-mm-aa-hh:mm", "objetivo": "descripción corta y concisa del objetivo de la cita"}.

      Si la información de la fecha o el objetivo es incompleta, el valor será **null** sin comillas. No generes el reporte si el mensaje exacto 'Hola, SOY EL ADMINISTRADOR, Resumir proceso de compra de este chat' no se ha recibido.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text:
                "Entendido, hoy es **" +
                dayjs().format("dddd") +
                "**. Cumpliré estrictamente con el proceso de agendamiento de citas y las validaciones de fechas. No me desviaré del tema.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Tienes dos funciones: 
        1. Preguntar el objetivo de la cita, que siempre debe estar relacionado con confección de ropa. debes hacer que el usuario se explaye lo mayor posible, especificando tallas, teas que le gustaria para su prenda, colores y todo lo relacionado a la confección de prendas.
        2. Asegurarte de obtener una fecha y hora válidas para la cita. Si falta algún dato, la fecha será null.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Comprendido, no generaré un reporte hasta que el mensaje sea exactamente 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat'.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Las citas deben cumplir con estas reglas:
        - De lunes a viernes, entre 8:00 AM y 5:00 PM.
        - Al menos 3 días hábiles de anticipación, recuerda la fecha de hoy, fechas antes del ${dayjs()
          .add(3, "days")
          .toDate()} son fechas inválidas, además recuerda que si el día es domingo o sábado tampoco podrás.
        - No superar los 2 meses desde hoy.
        - No permitir fechas ya ocupadas.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Cumpliré con las restricciones de horario y sugeriré alternativas si la fecha no es válida. Si no llegamos a un acuerdo, la fecha será null.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Vas a tratar con ${payload?.nombre}. Al finalizar la cita, recuérdale que recibirá un correo en ${payload?.email} cuando la modista acepte la cita. de ahora en más solo responde con texto plano, cero negrita italica, etc. puedes usar emojis. intenta resumir un poco tus respuestas y recuerda que el ${payload?.nombre} es colombiano.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Entendido. Continuaré ayudando a agendar la cita y respetaré todas las reglas.",
            },
          ],
        },
      ]);
    };

    fetchCitas();
  }, [token, triggerFetch]);

  useEffect(() => {
    setHistorial(initialHistory);
  }, [initialHistory]);

  const resetHistory = () => {
    setHistorial((prev) => {
      return prev.slice(0, 8);
    });
  };

  const sendMessage = async (message) => {
    setIsloadingMessage(true);
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-exp-1121" });

    const chat = model.startChat({
      history: historial,
    });
    let result = await chat.sendMessage(message);
    const responseText = result.response.text();
    setHistorial((prev) => [
      ...prev,
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: responseText }] },
    ]);
    setIsloadingMessage(false);
    return responseText;
  };

  const generarReporte = async () => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-exp-1121" });
    const chat = model.startChat({
      history: historial,
    });
    let result = await chat.sendMessage(
      "'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat' "
    );
    const responseText = result.response.text();
    return responseText;
  };

  return {
    sendMessage,
    historial,
    isLoadingMessage,
    resetHistory,
    generarReporte,
  };
};

export default useLLM;
