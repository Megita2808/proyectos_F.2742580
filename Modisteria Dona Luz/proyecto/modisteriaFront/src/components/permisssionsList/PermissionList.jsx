import { List, ListItem, ListItemText } from "@mui/material";
import "./permissionList.css";
export default function PermissionList({ permisos }) {
  return (
    <>
      <hr />
      <div className="listaPermisos">
        {permisos.map((permisoActivo) => (
          <ListItem key={permisoActivo.id}>
            <ListItemText primary={permisoActivo.nombre} />
          </ListItem>
        ))}
      </div>
    </>

  );
}
