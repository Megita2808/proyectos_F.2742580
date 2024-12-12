import "./App.css";
import { Routes, Route } from "react-router-dom";
import Error404 from "./pages/error404/Error404";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import LayoutDashboard from "./components/layoutManuela/LayoutDashboard";
import InicioSesion from "./pages/sesion/Sesion";
import Catalogo from "./pages/catalogo/Catalogo";
import Citas from "./pages/Citas/Citas";
import Perfil from "./pages/perfil/Perfil";
import Venta from "./pages/venta/Venta";
import Contacts from "./pages/contacts/index";
import CitasDashboard from "./pages/citasDashboard/citas";
import Insumo from "./pages/insumos/insumo";
import Roles from "./pages/roles/roles";
import Permisos from "./pages/permisos/permisos";
import Ventas from "./pages/ventas/index";
import Bar from "./pages/bar/index";
import Line from "./pages/line/index";
import Dashboard from "./pages/dashboard/index";
import CatalogoDashboard from "./pages/catalogoDashboard/index";
import CategoriaInsumos from "./pages/categoriaInsumo/categoriaInsumo";
import CategoriaPrenda from "./pages/categoriaPrenda/categoriaPrenda";
import Tallas from "./pages/tallas/Talla";
import ControlInsumos from "./pages/controlInsumos/ControlInsumos";
import UnidadesInsumo from "./pages/unidadesMedida/UnidadesMedida";
import Compras from "./pages/compras/Compras";
import Proveedores from "./pages/proveedores/Proveedores";
import Prueba from "./pages/prueba/Prueba";
import { useJwt } from "./context/JWTContext";
import useDecodedJwt from "./hooks/useJwt";
import Domicilio from "./pages/domicilio/Domicilio";
function App() {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="/registro" element={<Register />}></Route>
          <Route path="/sesion" element={<InicioSesion />}></Route>
          <Route path="/cita" element={<Citas />}></Route>
          <Route path="/catalogo" element={<Catalogo />}></Route>
          <Route path="/venta" element={<Venta />}></Route>
          <Route path="/perfil" element={<Perfil />}></Route>
        </Route>
        <Route path="/dashboard" element={<LayoutDashboard />}>
          <Route index element={<Dashboard />} />
          {payload?.permisos.includes(1) && (
            <Route path="/dashboard/contacts" element={<Contacts />} />
          )}
          {payload?.permisos.includes(5) && (
            <Route path="/dashboard/catalogo" element={<CatalogoDashboard />} />
          )}
          {payload?.permisos.includes(17) && (
            <Route path="/dashboard/compras" element={<Compras />} />
          )}
          {payload?.permisos.includes(12) && (
            <Route path="/dashboard/proveedores" element={<Proveedores />} />
          )}
          {payload?.permisos.includes(15) && (
            <Route
              path="/dashboard/categoriaInsumos"
              element={<CategoriaInsumos />}
            />
          )}
          {payload?.permisos.includes(6) && (
            <Route
              path="/dashboard/categoriaPrenda"
              element={<CategoriaPrenda />}
            />
          )}
          {payload?.permisos.includes(2) && (
            <Route path="/dashboard/cita" element={<Prueba />} />
          )}
          {payload?.permisos.includes(9) && (
            <Route path="/dashboard/insumo" element={<Insumo />} />
          )}
          {payload?.permisos.includes(13) && (
            <Route path="/dashboard/roles" element={<Roles />} />
          )}
          {payload?.permisos.includes(11) && (
            <Route path="/dashboard/permisos" element={<Permisos />} />
          )}
          {payload?.permisos.includes(3) && (
            <Route path="/dashboard/ventas" element={<Ventas />} />
          )}
          {payload?.permisos.includes(18) && (
            <Route
              path="/dashboard/controlInsumos"
              element={<ControlInsumos />}
            />
          )}
          {payload?.permisos.includes(16) && (
            <Route
              path="/dashboard/unidades-medida"
              element={<UnidadesInsumo />}
            />
          )}
          {payload?.permisos.includes(14) && (
            <Route path="/dashboard/tallas" element={<Tallas />} />
          )}
          {payload?.permisos.includes(19) && (
            <Route path="/dashboard/bar" element={<Bar />} />
          )}
          {payload?.permisos.includes(19) && (
            <Route path="/dashboard/line" element={<Line />} />
          )}
          {payload?.permisos.includes(7) && (
            <Route path="/dashboard/domicilios" element={<Domicilio />} />
          )}
        </Route>
        <Route path="*" element={<Error404 />}></Route>
      </Routes>
    </>
  );
}

export default App;
