const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^3\d{9}$/;

const constants = {
  EMAIL_REGEX,
  PHONE_REGEX,
};
export const messagesCalendar = {
  allDay: "Todo el día",
  showMore: (total, remainingEvents, events) => `+${total} más`,
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Sin eventos",
};
export const municipios = [
  {
    nombre: "Itagüí",
    precio: 18000,
  },
  {
    nombre: "Sabaneta",
    precio: 18000,
  },
  {
    nombre: "Envigado",
    precio: 18000,
  },
  {
    nombre: "Caldas",
    precio: 18000,
  },
  {
    nombre: "La estrella",
    precio: 18000,
  },
  {
    nombre: "Medellín",
    precio: 17500,
  },
  {
    nombre: "Bello",
    precio: 17500,
  },
  {
    nombre: "Copacabana",
    precio: 15500,
  },
  {
    nombre: "Girardota",
    precio: 15500,
  },
  {
    nombre: "Barbosa",
    precio: 15500,
  },
];
export const estadoCitasColores = [
  {
    nombre: "Por cotizar",
    color: "#F4D03F",
  },
  {
    nombre: "Cotizada (Modista)",
    color: "#E67E22",
  },
  {
    nombre: "Aceptada (Cliente)",
    color: "#27AE60",
  },
  {
    nombre: "Terminada",
    color: "#3498DB",
  },
  {
    nombre: "Cancelada",
    color: "#E74C3C",
  },
];
export const estadosVenta = [
  {
    id: 14,
    nombre: "Pagado",
    color: "#27AE60",
    descripcion:
      "La venta ha finalizado con éxito, el servicio fue entregado y la modista ha generado un ingreso económico.",
  },
  {
    id: 3,
    nombre: "Pendiente",
    color: "#E67E22",
    descripcion:
      "No ha sido comprabada la veracidad del pago, el actual administrador puede confirmar el ingreso o cancelar la venta siempre que se justifique.",
  },
  {
    id: 12,
    nombre: "Cancelada",
    color: "#E74C3C",
    descripcion:
      "La venta ha finalizado por un motivo de peso, el servicio NO fue entregado y la modista no verá reflejado un ingreso económico.",
  },
];
export const estadosDomicilio = [
  {
    id: 3,
    nombre: "Pendiente",
    color: "#F1C40F", // Amarillo: Aviso de que algo está pendiente
    descripcion:
      "El domicilio se ha creado recientemente, la modista deberá entonces acercarse al servicio de correspondencia y hacer entrega del número de guía del pedido.",
  },
  {
    id: 15,
    nombre: "En agencia",
    color: "#3498DB", // Azul: Refleja profesionalismo y proceso en tránsito
    descripcion:
      "La modista ha entregado el pedido a la agencia para llevar al sitio de entrega para posteriormente enviarle al usuario su número de guía",
  },
  {
    id: 16,
    nombre: "Devuelto",
    color: "#E67E22", // Naranja: Advertencia, algo salió fuera de lo planeado
    descripcion:
      "El pedido llegó al sitio de entrega sin embargo el usuario no lo recibió en el momento en el que lo llevaron, así que dicho pedido estará guardado en la sucursal de la agencia más cercana al sitio de entrega.",
  },
  {
    id: 6,
    nombre: "Entregado",
    color: "#2ECC71", // Verde: Representa éxito y finalización
    descripcion:
      "La agencia ha llevado el pedido al sitio de entrega y el usuario lo ha recibido.",
  },
  {
    id: 8,
    nombre: "Cancelado",
    color: "#E74C3C", // Rojo: Indica claramente que algo salió mal
    descripcion:
      "Se ha cancelado el domicilio debido a una ocurrencia con la venta. El usuario podrá revisar el motivo en su correo electrónico.",
  },
];

export const postSession = [
  {
    title: "Bienvenido a Modistería Doña Luz. ¡Agenda una cita con nosotros!",
    img: "https://i.pinimg.com/1200x/6d/fa/0b/6dfa0bc796ef1ef2560a7c832f361e14.jpg",
    published: "Modistería D.L",
    linkText: "Agendar cita",
    tag: "Cita",
    type: "article",
    link: "/cita",
  },
  {
    title: "¡Visita tu perfil y administra tu información! ",
    img: "https://i.pinimg.com/1200x/19/af/0c/19af0cc06f7dc0cebbbafbf649f4cda4.jpg",
    tag: "Perfil",
    published: "Modistería D.L",
    linkText: "Ir a perfil",
    type: "article",
    link: "/perfil",
  },
  {
    title:
      "Si deseas ver una muestra de nuestros servicios, puedes ver las prendas disponibles en nuestro catálogo",
    img: "https://i.pinimg.com/1200x/55/7f/34/557f3472cc354a2387040322b6d2e5f2.jpg",
    tag: "Catálogo",
    published: "Modistería D.L",
    linkText: "Ver catálogo",
    type: "article",
    link: "/catalogo",
  },
];
export const postsNoSession = [
  {
    title:
      "Bienvenido a Modistería Doña Luz. Si aún no tienes una cuenta, puedes Registrarte",
    img: "https://i.pinimg.com/1200x/6d/fa/0b/6dfa0bc796ef1ef2560a7c832f361e14.jpg",
    published: "Modistería D.L",
    linkText: "Registrarme",
    tag: "Registrate",
    type: "article",
    link: "/registro",
  },
  {
    title:
      "Si ya habías ingresado a Modistería Doña Luz, puedes Iniciar Sesión y hacer uso de nuestros servicios",
    img: "https://i.pinimg.com/1200x/19/af/0c/19af0cc06f7dc0cebbbafbf649f4cda4.jpg",
    tag: "Sesión",
    published: "Modistería D.L",
    linkText: "Inicia Sesión",
    type: "article",
    link: "/sesion",
  },
  {
    title:
      "Si deseas ver una muestra de nuestros servicios, puedes ver las prendas disponibles en nuestro catálogo",
    img: "https://i.pinimg.com/1200x/55/7f/34/557f3472cc354a2387040322b6d2e5f2.jpg",
    tag: "Catálogo",
    published: "Modistería D.L",
    linkText: "Ver catálogo",
    type: "article",
    link: "/catalogo",
  },
];

export const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "bmp",
  "tiff",
  "heic",
  "svg",
  "webp",
  "heif",
  "ico",
];

export const formatDateSpanish = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("es-ES", options);
};

export const formaTime = (dateString) => {
  const date = new Date(dateString);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
};

export const formToCop = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

export const toggleState = (setState) => {
  setState((prev) => !prev);
};

export const URL_BACK = import.meta.env.VITE_URL_BACK_API;

export default constants;
