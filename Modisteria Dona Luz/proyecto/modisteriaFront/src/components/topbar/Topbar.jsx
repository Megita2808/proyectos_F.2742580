import { Box, colors, IconButton, useTheme } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { LogoutOutlined } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Transition from "../transition/Transition";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const [isLogoutModalOpened, setIsLogoutModalOpened] = useState(false);
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const toggleLogoutModal = () => setIsLogoutModalOpened(!isLogoutModalOpened);
  const logout = () => {
    setIsLogoutModalOpened(!isLogoutModalOpened);
    navigate("/");
  };
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box>
        {/* //   display="flex"
      //   backgroundColor={colors.primary[400]}
      //   borderRadius="3px"
      // > */}
        {/* //   <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
      //   <IconButton type="button" sx={{ p: 1 }}>
      //     <SearchIcon />
      //   </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={toggleLogoutModal}>
          <LogoutOutlined></LogoutOutlined>
        </IconButton>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Box>
      <Dialog
        open={isLogoutModalOpened}
        keepMounted
        TransitionComponent={Transition}
        onClose={toggleLogoutModal}
      >
        <DialogTitle color={colors.grey[100]}>
          {"¿Deseas salir del panel del administrador?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Recuerda que puedes volver en todo momento.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            sx={{ textTransform: "capitalize" }}
            onClick={toggleLogoutModal}
          >
            Cancelar
          </Button>
          <Button
            color="success"
            sx={{ textTransform: "capitalize" }}
            onClick={logout}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
