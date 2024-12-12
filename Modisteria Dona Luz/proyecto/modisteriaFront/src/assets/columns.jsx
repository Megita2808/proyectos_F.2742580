import { Button, Switch, alpha, Box } from "@mui/material";
import { Edit, TrashColor, Eye, Check, Cancel } from "../components/svg/Svg";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { estadosDomicilio, estadosVenta, formToCop } from "./constants.d";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import dayjs from "dayjs";

function Actions({ colors, row, onEdit, onDelete, eye, onPreview }) {
  return (
    <div>
      {eye && (
        <Button onClick={() => onPreview(row)}>
          <Eye size={20} color={colors.grey[100]} />
        </Button>
      )}
      <Button onClick={() => onEdit(row)}>
        <Edit size={20} color={colors.grey[100]} />
      </Button>
      <Button onClick={() => onDelete(row)}>
        <TrashColor size={20} color={colors.grey[100]} />
      </Button>
    </div>
  );
}
function SwitchCustom({ row, changeState }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Switch
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: colors.purple[200],
          "&:hover": {
            backgroundColor: alpha(
              colors.purple[200],
              theme.palette.action.hoverOpacity
            ),
          },
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: colors.purple[200],
        },
      }}
      color="warning"
      checked={row.estadoId === 1}
      onChange={(e) => changeState(e, row)}
    />
  );
}

export const ColumnsTallas = ({ onEdit, onDelete }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  { field: "tipo", headerName: "Tipo", flex: 1 },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsUnidadesDeMedida = ({ onEdit, onDelete }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsCategoriaPrendas = ({
  onEdit,
  onDelete,
  onDownload,
  changeState,
}) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 2,
    valueGetter: (params) =>
      params.row.descripcion ? params.row.descripcion : "Sin descripción",
  },
  {
    field: "molde",
    headerName: "Molde",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      return (
        row.molde && (
          <Button onClick={() => onDownload(row)}>
            <PictureAsPdfIcon size={20} sx={{ color: "#fff" }} />
          </Button>
        )
      );
    },
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsInsumos = ({
  onEdit,
  onDelete,
  changeState,
  getCategoriaNombre,
  getUnidadMedida,
}) => [
  {
    field: "nombre",
    headerName: "Nombre",
    flex: 1,
  },
  {
    field: "cantidad",
    headerName: "Cantidad",
    flex: 1,
    valueGetter: (params) =>
      `${params.row.cantidad}  ${getUnidadMedida(params.row.unidadMedidaId)}`,
  },
  {
    field: "categoriaInsumoId",
    headerName: "Categoría",
    flex: 1,
    valueGetter: (params) => getCategoriaNombre(params.row.categoriaInsumoId),
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
export const ColumnsUsuarios = ({
  onEdit,
  onDelete,
  changeState,
  getRoleId,
  payload,
}) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  { field: "email", headerName: "Correo", flex: 1 },
  { field: "telefono", headerName: "Teléfono", flex: 1 },
  {
    field: "direccion",
    headerName: "Dirección",
    flex: 1,
    valueGetter: (params) =>
      params.row.direccion ? params.row.direccion : "Sin dirección agregada",
  },
  {
    field: "roleId",
    headerName: "Rol",
    flex: 1,
    valueGetter: (params) => getRoleId(params.row.roleId),
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) =>
      payload?.email !== row.email ? (
        <SwitchCustom row={row} changeState={changeState} />
      ) : (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <h4>Usuario activo</h4>
        </Box>
      ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      return row.email === payload?.email ? (
        <Box sx={{ textAlign: "center", mx: "auto" }}>
          <h4>Sin acciones</h4>
        </Box>
      ) : (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
export const ColumnsProveedores = ({ onEdit, onDelete, changeState }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  { field: "telefono", headerName: "Teléfono", flex: 1 },
  {
    field: "direccion",
    headerName: "Dirección",
    flex: 1,
    valueGetter: (params) =>
      params.row.direccion ? params.row.direccion : "Sin dirección agregada",
  },

  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsCategoriaInsumos = ({ onEdit, onDelete, changeState }) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "tipo",
    headerName: "Tipo insumo",
    flex: 1,
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 2,
    valueGetter: (params) =>
      params.row.descripcion ? params.row.descripcion : "Sin descripción",
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

export const ColumnsVentas = ({
  handleCancel,
  handleConfirm,
  handleDetails,
}) => [
  {
    field: "fecha",
    headerName: "Fecha",
    flex: 2,
    renderCell: (params) =>
      dayjs(params.value).format("DD [de] MMMM [del] YYYY [a las] HH:mm A"),
  },
  {
    field: "origen",
    headerName: "Origen",
    flex: 1,
    valueGetter: (params) => (params.row.citaId ? "Cita" : "Catálogo"),
  },
  {
    field: "id",
    headerName: "Detalles",
    flex: 0.5,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      return (
        <Button
          onClick={() => {
            handleDetails(row);
          }}
        >
          <Eye size={20} color={colors.grey[100]} />
        </Button>
      );
    },
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: (params) => {
      const estado = estadosVenta.find((estado) => estado.id === params.value);
      return estado ? (
        <h3 style={{ color: estado.color }}>{estado.nombre}</h3>
      ) : (
        <h4>Desconocido</h4>
      );
    },
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      if (row.estadoId === 3) {
        return (
          <div>
            <Button
              title="Confirmar venta"
              onClick={() => {
                handleConfirm(row);
              }}
            >
              <Check size={20} color="#008000" />
            </Button>
            <Button
              title="Cancelar venta"
              onClick={() => {
                handleCancel(row);
              }}
            >
              <Cancel size={20} color="#E74C3C" />
            </Button>
          </div>
        );
      } else {
        return <span style={{ paddingLeft: "25px" }}>Sin acciones</span>;
      }
    },
  },
];

export const ColumnsDomicilios = ({ handleConfirm, handleDetails }) => [
  {
    field: "ventas.fecha",
    headerName: "Fecha",
    flex: 1.2,
    renderCell: (params) =>
      dayjs(params.value).format("DD [de] MMMM [del] YYYY [a las] HH:mm A"),
  },
  {
    field: "estadoId",
    headerName: "Estados",
    flex: 1,
    renderCell: (params) => {
      const estado = estadosDomicilio.find(
        (estado) => estado.id === params.value
      );
      return estado ? (
        <h3 style={{ color: estado.color }}>{estado.nombre}</h3>
      ) : (
        <h4>Desconocido</h4>
      );
    },
  },
  {
    field: "id",
    headerName: "Acciones",
    flex: 0.7,
    renderCell: ({ row }) => {
      if (row.estadoId === 3) {
        return (
          <div>
            <Button
              title="Confirmar venta"
              onClick={() => {
                handleConfirm(row);
              }}
            >
              <Check size={20} color="#008000" />
            </Button>
          </div>
        );
      } else {
        return <span style={{ paddingLeft: "25px" }}>Sin acciones</span>;
      }
    },
  },
  // {
  //   field: "estadoId",
  //   headerName: "Estado",
  //   flex: 1,
  //   renderCell: (params) => {
  //     const estado = estadosVenta.find((estado) => estado.id === params.value);
  //     return estado ? (
  //       <h3 style={{ color: estado.color }}>{estado.nombre}</h3>
  //     ) : (
  //       <h4>Desconocido</h4>
  //     );
  //   },
  // },
  // {
  //   field: "acciones",
  //   headerName: "Acciones",
  //   flex: 1,
  //   renderCell: ({ row }) => {
  //     if (row.estadoId === 3) {
  //       return (
  //         <div>
  //           {/* Mostrar solo el botón de Confirmar venta */}
  //           <Button
  //             title="Confirmar venta"
  //             onClick={() => {
  //               handleConfirm(row);
  //             }}
  //           >
  //             <Check size={20} color="#008000" />
  //           </Button>

  //           {/* Mostrar el botón de Cancelar venta solo si el origen es Cita */}
  //           {row.citaId === null && (
  //             <Button
  //               title="Cancelar venta"
  //               onClick={() => {
  //                 handleCancel(row);
  //               }}
  //             >
  //               <Cancel size={20} color="#E74C3C" />
  //             </Button>
  //           )}
  //         </div>
  //       );
  //     } else {
  //       return <span style={{ paddingLeft: "25px" }}>Sin acciones</span>;
  //     }
  //   },
  // },
];

export const ColumnsRoles = ({
  onEdit,
  onDelete,
  changeState,
  handlePermission,
}) => [
  { field: "nombre", headerName: "Nombre", flex: 1 },
  {
    field: "permisosId",
    headerName: "Permisos",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      row.permisos = row.Permisos.map((permiso) => permiso.id);
      return (
        <Button
          onClick={() => {
            handlePermission(row);
          }}
        >
          <Eye size={20} color={colors.grey[100]}></Eye>
        </Button>
      );
    },
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) =>
      row.id >= 5 ? (
        <SwitchCustom row={row} changeState={changeState} />
      ) : (
        "Activo"
      ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return row.id >= 5 ? (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <span style={{ paddingLeft: "25px" }}>Sin acciones</span>
      );
    },
  },
];

export const ColumnsCatalogo = ({
  onEdit,
  onDelete,
  changeState,
  getCategoriaNombre,
  OnPreview,
}) => [
  { field: "producto", headerName: "Nombre", flex: 1 },
  {
    field: "precio",
    headerName: "Precio",
    flex: 1,
    valueGetter: (params) => formToCop(params.row.precio),
  },
  {
    field: "categoriaId",
    headerName: "Categoría",
    flex: 1,
    valueGetter: (params) => getCategoriaNombre(params.row.categoriaId),
  },
  {
    field: "estadoId",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => (
      <SwitchCustom row={row} changeState={changeState} />
    ),
  },
  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1.5,
    renderCell: ({ row }) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);
      row.tallas = row.Tallas.map((talla) => talla.id);
      return (
        <Actions
          colors={colors}
          row={row}
          onEdit={onEdit}
          onDelete={onDelete}
          eye
          onPreview={OnPreview}
        />
      );
    },
  },
];
