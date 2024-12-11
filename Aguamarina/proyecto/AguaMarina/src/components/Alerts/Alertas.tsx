// alerts.ts
import Swal, { SweetAlertIcon } from "sweetalert2";

// Tipado de los parámetros para `showAlert`
interface AlertOptions {
  icon?: SweetAlertIcon;
  title: string;
  text: string;
  timer?: number;
  showConfirmButton?: boolean;
  iconColor?: string;
  color?: string;
  background?: string;
}

// Función base para crear alertas personalizadas
const showAlert = async ({
  icon = "info",
  title,
  text,
  timer = 3000,
  showConfirmButton = true,
  iconColor = "#fefefe",
  color = "#fefefe",
  background = "url(/images/grids/bg-modal-dark.jpeg)"
}: AlertOptions): Promise<void> => {
  await Swal.fire({
    icon,
    title,
    text,
    timer,
    showConfirmButton,
    iconColor,
    color,
    background,
    customClass: {
      popup: "rounded-3xl shadow shadow-6",
    },
  });
};

// Funciones para tipos específicos de alertas
export const alertSuccess = (title: string, text: string): Promise<void> =>
  showAlert({
    icon: "success",
    title,
    text,
    iconColor: "#28a745",
    showConfirmButton: false,
  });

export const alertError = (title: string, text: string): Promise<void> =>
  showAlert({
    icon: "error",
    title,
    text,
    iconColor: "#ff4d4f",
  });

export const alertWarning = (title: string, text: string): Promise<void> =>
  showAlert({
    icon: "warning",
    title,
    text,
    iconColor: "#ffa940",
    timer: 4000,
  });

export const alertInfo = (title: string, text: string): Promise<void> =>
  showAlert({
    icon: "info",
    title,
    text,
    iconColor: "#1890ff",
  });
