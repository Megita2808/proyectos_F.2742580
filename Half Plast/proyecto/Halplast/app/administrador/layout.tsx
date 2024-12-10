"use client";

import "./css/globals.css";
import "./css/modal.css";
import "./css/satoshi.css";
import "./css/data-tables-css.css";
import { useEffect, useState } from "react";
import Loader from "@/components/administrador/common/Loader";
import Sidebar from "@/components/administrador/Sidebar/Sidebar";
import Header from "@/components/administrador/Header";
import { useAuth } from "@/context/AutenticacionContext";
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from "@/components/administrador/Sidebar/use-sidebar";
import { useModal } from "@/components/administrador/Sidebar/use-modale";

export default function AdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, rol } = useAuth();
  const router = useRouter();
  const currentPath = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { resetModals } = useModal();

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const routesWithPermissions = [
    { path: '/administrador', permission: 'Dashboard' },
    { path: '/administrador/tables/configuracion/permisos', permission: 'Configuración' },
    { path: '/administrador/tables/configuracion/roles', permission: 'Configuración' },
    { path: '/administrador/tables/usuarios/cliente', permission: 'Gestión de Usuarios' },
    { path: '/administrador/tables/Distribuidor', permission: 'Distribuidores' },
    { path: '/administrador/tables/compras/compra', permission: 'Compras' },
    { path: '/administrador/tables/Catalogo/categoria', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/producto', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/medidaProducto', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/medidaVenta', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/color', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/peso', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/unidadMedida', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/Catalogo/precioVenta', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/img', permission: 'Gestión de Catálogo' },
    { path: '/administrador/tables/ventas/venta', permission: 'Gestión de Ventas' },
    { path: '/administrador/tables/envios', permission: 'Envíos' },
    { path: '/administrador/calendar', permission: 'Calendario' },
    { path: '/administrador/Inventario', permission: 'Inventario' },
    { path: '/administrador/Informes', permission: 'Informes' },
  ];

  useEffect(() => {
    const validateAccess = () => {
      if (isLoggedIn && rol) {
        const route = routesWithPermissions.find((route) => currentPath === route.path);
        
        if (route) {
          const hasPermission = rol.permisos.some(
            (permiso) => permiso.nombrePermiso === route.permission
          );

          if (hasPermission) {
            setHasAccess(true);
            resetModals();
          } else {
            router.push("/cliente/principal");
          }
        } else {
          setHasAccess(true);
        }
      } else {
        router.push("/cliente/principal");
      }
      setLoading(false);
    };

    validateAccess();
  }, [isLoggedIn, rol, currentPath, router, resetModals]);

  if (loading) {
    return <Loader />;
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="dark:bg-black dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={isSidebarOpen} setSidebarOpen={toggleSidebar} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
