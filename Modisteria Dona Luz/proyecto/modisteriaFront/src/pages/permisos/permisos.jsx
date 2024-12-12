//mirando
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Switch,
} from "@mui/material";
import Loading from "../../components/loading/Loading";
import { Edit } from "../../components/svg/Svg";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import Transition from "../../components/transition/Transition";
import usePermisosData from "../../hooks/usePermisosData";
import {
  ShoppingCartOutlined,
  ViewListOutlined,
  AdminPanelSettingsOutlined,
  LockOutlined,
  Inventory2Outlined,
  StyleOutlined,
  CalendarTodayOutlined,
  InventoryOutlined,
  HelpOutlineOutlined,
  StraightenOutlined,
  HistoryOutlined,
  Settings,
  TableChart,
  BarChart,
  PointOfSale,
} from "@mui/icons-material";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
const Permisos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    handleSubmit: handleSavePermiso,
    watch: watchSavePermiso,
    formState: { errors: errorsAddPermiso },
    register: registerPermiso,
    reset,
  } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [permisoToDelete, setPermisoToDelete] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const {
    initialFetchAllPermisos,
    fetchAllPermisos,
    // deletePermisos,
    loading,
    updatePermisos,
  } = usePermisosData();
  useEffect(() => {
    const initialFetchPermisos = async () => {
      const respuesta = await initialFetchAllPermisos();

      if (respuesta.status === 200 && respuesta.data) {
        setData(respuesta.data);
      }
    };
    initialFetchPermisos();
  }, []);

  /// Métodos para CRUD
  const handleEdit = (id) => {
    const permisoToEdit = data.find((permiso) => permiso.id === id);
    setSelectedPermiso(permisoToEdit);
    reset(permisoToEdit);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedPermiso(null);
  };

  const handleSave = async (data) => {
    const response = await updatePermisos(selectedPermiso.id, data);
    if (response.status === 200 || response.status === 201) {
      const updatedData = await fetchAllPermisos();
      if (updatedData.status === 200 && updatedData.data) {
        setData(updatedData.data);
      }
      handleClose();
    } else {
      console.log(response);
    }
  };

  //   const handleDelete = (id) => {
  //     const permiso = data.find((permiso) => permiso.id === id);
  //     setPermisoToDelete(permiso);
  //     setOpenDeleteDialog(true);
  //   };

  //   const confirmDelete = async () => {
  //     if (permisoToDelete.estadoId === 1) {
  //       setErrorMessage("No se puede eliminar el permiso porque está activo.");
  //       setOpenErrorModal(true);
  //       setOpenDeleteDialog(false);
  //       return;
  //     }

  //     const response = await deletePermisos(permisoToDelete.id);

  //     if (response.status === 200 || response.status === 201) {
  //       setData((prevData) =>
  //         prevData.filter((permiso) => permiso.id !== permisoToDelete.id)
  //       );
  //       setOpenDeleteDialog(false);
  //       setPermisoToDelete(null);
  //     }
  //   };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPermiso((prev) => ({ ...prev, [name]: value }));
  };
  // Fin métodos CRUD
  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button onClick={() => handleEdit(row.id)}>
            <Edit size={20} color={colors.grey[100]} />
          </Button>
          {/* <Button onClick={() => handleDelete(row.id)} sx={{ ml: 1 }}>
            <TrashColor size={20} color={colors.grey[100]} />
          </Button> */}
        </Box>
      ),
    },
  ];

  return (
    <>
      <br />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ ml: 4 }} fontSize={"40px"}>
          <LockOutlined
            sx={{ color: colors.purple[400], fontSize: "40px", mr: 1 }}
          />
          Permisos
        </Typography>
      </Box>
      <br />
      <Box
        m="0px 20px"
        p="0px 10px"
        height="65%"
        width="98%"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.purple[500],
            borderBottom: "none",
            color: "white",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[200],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.purple[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        {loading ? (
          <Box marginLeft={"175px"}>
            <LoadingTableData></LoadingTableData>
          </Box>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row.id}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              height: "70vh",
            }}
          />
        )}
      </Box>

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={handleClose}
      >
        <form onSubmit={handleSavePermiso(handleSave)}>
          <DialogTitle color={colors.grey[100]}>Editar Permiso</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="descripcion"
              label="Descripción"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "purple",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple",
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: "purple",
                  },
                },
              }}
              type="text"
              fullWidth
              variant="outlined"
              {...registerPermiso("descripcion", {
                required: "La descripción es requerida",
                minLength: {
                  value: 4,
                  message: "La descripción debe tener mínimo 4 caracteres!",
                },
              })}
              value={selectedPermiso?.descripcion || ""}
              onChange={handleInputChange}
              FormHelperTextProps={{ sx: { color: "red" } }}
              helperText={errorsAddPermiso?.descripcion?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ textTransform: "capitalize" }}
              onClick={handleClose}
              color="error"
            >
              Cancelar
            </Button>
            <Button
              sx={{ textTransform: "capitalize" }}
              type="submit"
              color="success"
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle color={colors.grey[100]}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el permiso "
            {permisoToDelete?.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog> */}

      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
      >
        <DialogTitle color={colors.grey[100]}>Error</DialogTitle>
        <DialogContent>
          <Typography color={colors.grey[100]}>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: "capitalize" }}
            onClick={() => setOpenErrorModal(false)}
            color="error"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Permisos;
