import { DialogActions, Button } from "@mui/material";
export default function CustomDialogActions({
  cancelButton,
  saveButton,
  customCancelColor,
  deleteButton,
  handleClose,
}) {
  return (
    <DialogActions>
      {cancelButton && (
        <Button
          sx={{ textTransform: "capitalize" }}
          onClick={handleClose}
          color={customCancelColor || "error"}
        >
          Cancelar
        </Button>
      )}

      {saveButton && (
        <Button
          sx={{ textTransform: "capitalize" }}
          type="submit"
          color="success"
        >
          Guardar
        </Button>
      )}
      {deleteButton && (
        <Button
          sx={{ textTransform: "capitalize" }}
          type="submit"
          color="error"
        >
          Eliminar
        </Button>
      )}
    </DialogActions>
  );
}
