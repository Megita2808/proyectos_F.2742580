import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  DialogContentText,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

// Componentes personalizados
import Header from "../../components/Header/Header";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import ContainerDataGrid from "../../components/containerDatagrid/ContainerDataGrid";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";

// Hooks y constantes
import useVentasData from "../../hooks/useVentasData";
import { ColumnsVentas } from "../../assets/columns";
import { estadosVenta, formToCop, toggleState } from "../../assets/constants.d";

// Estilos
import "./ventasDash.css";
import { ShoppingCartOutlined } from "@mui/icons-material";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import InputDash from "../../components/inputDashboard/InputDash";
import useCitasData from "../../hooks/useCitasData";

export default function Ventas() {
  // Estados
  const [data, setData] = useState([]);
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
    origen: "",
    row: null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Hooks personalizados
  const { fetchAllVentas, cancelarVenta, initialFetchAllVentas, loading } =
    useVentasData();
  const { createVenta } = useCitasData(); // Asegúrate de tener esta función para terminar la cita.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Efecto inicial
  useEffect(() => {
    const initialFetch = async () => {
      const response = await initialFetchAllVentas();
      if (response.status === 200) setData(response.data);
    };
    initialFetch();
  }, []);

  // Funciones específicas
  const terminarCitaHandler = async () => {
    const response = await createVenta({ citaId: dialogProps.row.citaId });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error al terminar la cita.");
    }
  };

  const confirmarVenta = async () => {
    const response = await confirmarVenta(dialogProps.row.id);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error al confirmar la venta.");
    }
    setData((prevData) =>
      prevData.map((venta) =>
        venta.id === dialogProps.row.id ? { ...venta, estadoId: 14 } : venta
      )
    );
  };

  const cancelVenta = async (formData) => {
    const response = await cancelarVenta(dialogProps.row.id, {
      motivo: formData.motivo,
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error al cancelar la venta.");
    }
    setData((prevData) =>
      prevData.map((venta) =>
        venta.id === dialogProps.row.id ? { ...venta, estadoId: 12 } : venta
      )
    );
  };

  const handleAction = async (formData) => {
    const origen = dialogProps.row?.citaId === null ? "Catálogo" : "Cita";

    const actionMap = {
      confirm: {
        Cita: terminarCitaHandler, // Acción para Cita
        Catálogo: confirmarVenta, // Acción para Catálogo
      },
      cancel: {
        Cita: cancelVenta,
        Catálogo: cancelVenta,
      },
    };

    const actionFn = actionMap[dialogProps.action]?.[origen];

    if (actionFn) {
      try {
        await actionFn(formData);
        toast.success("¡Operación realizada con éxito!");
        toggleState(setOpenAddModal); // Cerrar el modal
      } catch (error) {
        toast.error(`Error en la operación: ${error.message}`);
      }
    } else {
      toast.error("Acción no válida.");
    }
  };

  // Función para configurar el diálogo
  const handleDialog = (action, title, origen, row = null) => {
    setDialogProps({ action, title, origen, row });
    reset({ motivo: "" });
    toggleState(setOpenAddModal);
  };

  const columns = ColumnsVentas({
    handleDetails: (row) =>
      handleDialog("verDetalles", "Detalles de la Venta", "Catálogo", row),
    handleConfirm: (row) =>
      handleDialog(
        "confirm",
        row?.citaId !== null ? "Terminar Cita" : "Confirmar Venta", // Cambiar el título según citaId
        "Catálogo",
        row
      ),
    handleCancel: (row) =>
      handleDialog("cancel", "Cancelar Venta", "Catálogo", row),
  });

  // Renderizado
  return (
    <>
      <Header
        title="Ventas"
        buttonText="Ver estados"
        handleAdd={() =>
          handleDialog("info", "Estados de la venta", "Catálogo")
        }
        icon={ShoppingCartOutlined}
      />
      <br />
      <ContainerDataGrid>
        {loading ? (
          <LoadingTableData />
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            initialState={{
              sorting: { sortModel: [{ field: "fecha", sort: "asc" }] },
            }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        )}
      </ContainerDataGrid>
      <Dialog
        open={openAddModal}
        onClose={() => toggleState(setOpenAddModal)}
        sx={{
          "& .MuiDialog-paper": { width: "65%", maxWidth: "none" },
        }}
      >
        <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
        <form onSubmit={handleSubmit(handleAction)}>
          <DialogContent>
            {dialogProps.action === "info" && (
              <section className="info-section">
                {estadosVenta.map((estado, idx) => (
                  <div key={idx}>
                    <article>
                      <span
                        style={{ background: estado.color }}
                        className="color-estado"
                      ></span>
                      <span>{estado.nombre}</span>
                    </article>
                    <p>{estado.descripcion}</p>
                  </div>
                ))}
              </section>
            )}
            {dialogProps.action === "verDetalles" && (
              <div className="venta-card">
                <div className="venta-imagen">
                  {dialogProps.row?.imagen ? (
                    <img src={dialogProps.row.imagen} alt="Imagen" />
                  ) : (
                    <div className="no-image">
                      <h3>¡Sin transferencia!</h3>
                      <span>El comprador pagó en la modistería</span>
                    </div>
                  )}
                </div>
                <div className="venta-info">
                  <div className="campo">
                    <label>Nombre comprador:</label>
                    <span>
                      {dialogProps.row?.nombrePersona || "Sin nombre asociado"}
                    </span>
                  </div>
                  <div className="campo">
                    <label>Valor Final:</label>
                    <span>
                      {dialogProps.row?.valorFinal
                        ? `${formToCop(dialogProps.row.valorFinal)} COP`
                        : "No aplica"}
                    </span>
                  </div>
                  <div className="campo">
                    <label>Método de Pago:</label>
                    <span>
                      {dialogProps.row?.metodoPago || "No especificado"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {dialogProps.action === "confirm" && (
              <DialogContentText textAlign={"center"}>
                {dialogProps.row?.citaId !== null
                  ? "Esta acción terminará la cita. Asegúrese de que la cita esté completada antes de terminarla."
                  : "Esta acción confirmará la venta. ¡Asegúrese del correcto pago antes de confirmarla!"}
              </DialogContentText>
            )}
            {dialogProps.action === "cancel" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <InputDash
                  label="Motivo de Cancelación"
                  {...register("motivo", {
                    required:
                      "¡Debes especificar el motivo por el que la venta se cancela!",
                    minLength: {
                      message:
                        "¡La justificación debe ser de mínimo 4 caracteres!",
                      value: 4,
                    },
                  })}
                  error={errors.motivo?.message}
                  multiline
                  rows={3}
                />
              </div>
            )}
          </DialogContent>
          <CustomDialogActions
            handleClose={() => toggleState(setOpenAddModal)}
            handleSubmit={handleSubmit(handleAction)}
            cancelButton={true} // Botón Cancelar visible
            saveButton={true} // Botón Guardar visible
          />
        </form>
      </Dialog>
      <ToastContainer />
    </>
  );
}
