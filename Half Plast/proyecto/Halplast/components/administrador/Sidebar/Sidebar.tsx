import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LineChartIcon,
  MenuIcon,
  ShoppingBag,
  AreaChart,
  Calendar,
  User2Icon,
  LockIcon,
  BarChart2,
  Component,
  Settings,
  Table2Icon,
  FormInputIcon,
  HomeIcon,
  LampIcon,
  SignalHigh,
  AlertCircle,
  SwissFranc,
  MousePointerClick,
  ShoppingCart,
  ScrollText,
  Palette,
  ClipboardPlus,
  ClipboardMinus,
  Package,
  PackageOpen,
  DollarSign,
  Images,
  Ruler,
  Weight,
  User,
  BookUser,
  BaggageClaim,
  HardHat,
  ShieldOff,
  Activity,
  Send,
  ArchiveRestore,
  BookOpenCheck,
  UserRoundCheck,
  UserRoundCog,
  UserRoundIcon,
  UserRoundPen,
  PackageCheck,
  Truck,
  FileQuestion,
  ClipboardList,
  FileType,
  BookMarked,
  BookCopy,
  List,
  ListCheck,
} from "lucide-react";
import { useSidebar } from "./use-sidebar";
import { useModal } from "./use-modale";
import { cn } from "@/app/administrador/libs/utlis";
import MenuItem from "./MenuItem";
import LinkItem from "./LinkItem";
import ExpandMenu from "./ExpandMenu";
import clipboardIcon from '@/public/icons/supplier.png';
import { useAuth } from "@/context/AutenticacionContext";

interface SidebarProps {}

const Sidebar = ({}: SidebarProps) => {

  const { isLoggedIn, rol } = useAuth();
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { isModalOpen, ModalAgregarAbrir, isModalAbrirImagen } = useModal();
  const [isSidebarUserControlled, setIsSidebarUserControlled] = useState(false);

  const handleToggleSidebarManually = () => {
    setIsSidebarUserControlled(true);
    toggleSidebar();
  };

  useEffect(() => {
    if ((isModalOpen || ModalAgregarAbrir || isModalAbrirImagen) && isSidebarOpen) {
      setIsSidebarUserControlled(false);
      toggleSidebar();
    }
  }, [isModalOpen, ModalAgregarAbrir, isModalAbrirImagen, isSidebarOpen, toggleSidebar]);
  
  useEffect(() => {
    if (!isModalOpen && !ModalAgregarAbrir && !isModalAbrirImagen && !isSidebarOpen && !isSidebarUserControlled) {
      toggleSidebar();
    }
  }, [isModalOpen, ModalAgregarAbrir, isModalAbrirImagen, isSidebarOpen, toggleSidebar, isSidebarUserControlled]);
  
  useEffect(() => {
    if (!isModalOpen && !ModalAgregarAbrir && !isModalAbrirImagen) {
      setIsSidebarUserControlled(false);
    }
  }, [isModalOpen, ModalAgregarAbrir, isModalAbrirImagen]);

  return (
    <aside
      className={cn(
        `absolute left-0 top-0 z-9999 flex h-screen w-20 flex-col overflow-y-hidden bg-black duration-300 ease-linear  dark:bg-boxdark lg:static lg:translate-x-0 `,
        {
          "w-70": isSidebarOpen,
        },
      )}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="relative flex w-full items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link className="flex items-center" href="/">
        <Image
            className="h-10 w-10 rounded-md"
            width={400}
            height={400}
            src="https://raw.githubusercontent.com/castano208/imagenesHalplast/main/logo.png"
            alt="Logo"
        />
          {isSidebarOpen && (
            <h1 className="ml-2 text-xl font-semibold text-white">Halplast</h1>
          )}
        </Link>
        {isSidebarOpen && (
          <MenuIcon onClick={handleToggleSidebarManually} className="h-6 w-6 text-white cursor-pointer" />
        )}
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="px-4 py-4  lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul
              className={cn("mb-6 flex flex-col  gap-1.5", {
                "items-center justify-center": !isSidebarOpen,
              })}
            >
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <ExpandMenu
                  name="Homepage"
                  icon={<HomeIcon className="  h-6 w-6 hover:text-white" />}
                >
                  <LinkItem
                    icon={<ShoppingBag />}
                    title="Tienda"
                    href="/"
                  />
                  {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Dashboard Estadisticas' || permiso.nombrePermiso === 'Informes') &&
                    <LinkItem
                      icon={<LockIcon />}
                      title="Dashboard"
                      href="/administrador"
                    />
                  )}
                </ExpandMenu>
              </li>
              {/* <!-- Menu Usuario--> */}
              <li>
                <ExpandMenu
                  name="Usuario"
                  icon={<User className="  h-6 w-6 hover:text-white" />}
                >

                  <ExpandMenu
                    name="Configuración"
                    icon={<Settings className="  h-6 w-6 hover:text-white" />}
                  >
                    <LinkItem
                      icon={<UserRoundCog />}
                      title="Roles"
                      href="/administrador/tables/configuracion/roles"
                    />
                    <LinkItem
                      icon={<UserRoundPen />}
                      title="Permisos"
                      href="/administrador/tables/configuracion/permisos"
                    />
                  </ExpandMenu>

                  <ExpandMenu
                    name="Usuarios"
                    icon={<BookUser className="  h-6 w-6 hover:text-white" />}
                  >

                    <LinkItem
                      icon={<ScrollText />}
                      title="Listado"
                      href="/administrador/tables/usuarios/cliente"
                    />

                  </ExpandMenu>

                  <ExpandMenu
                    name="Distribuidores"
                    icon={<BaggageClaim className="  h-6 w-6 hover:text-white" />}
                  >
                    <LinkItem
                      icon={<ListCheck />}
                      title="Listado"
                      href="/administrador/tables/Distribuidor"
                    />
                  </ExpandMenu>

                  {/* <ExpandMenu
                    name="Empleados"
                    icon={<HardHat className="  h-6 w-6 hover:text-white" />}
                  >                   
                    <LinkItem
                      icon={<ScrollText />}
                      title="Listado"
                      href="/administrador/tables/usuarios/empleado"
                    />
                  </ExpandMenu> */}

                </ExpandMenu>
              </li>
              {/* <!-- Menu Compra --> */}
              {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Compras') && 
                <li>
                  <ExpandMenu
                    name="Compra"
                    icon={<Truck className="  h-6 w-6 hover:text-white" />}
                  >
                    <LinkItem
                      icon={<ClipboardList className="  h-7 w-7 hover:text-white" />}
                      title="Listado"
                      href="/administrador/tables/compras/compra"
                    />
                    {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Gestión de Proveedores') && 
                      <LinkItem
                        icon={
                          <Image
                            src={clipboardIcon}
                            alt="Listado Icon"
                            className=" h-8 w-7 hover:text-white"
                            style={{
                              filter: 'invert(1) brightness(2)',
                            }}
                          />
                        }
                        title="Proveedor"
                        href="/administrador/tables/compras/proveedor"
                      />
                    )}

                    {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Gestión de Catálogo') && 
                      <ExpandMenu
                        name="Catalogo"
                        icon={<ScrollText className="  h-6 w-6 hover:text-white" />}
                      >
                        <LinkItem
                          icon={<ShoppingBag />}
                          title="Categoria"
                          href="/administrador/tables/Catalogo/categoria"
                        />
                        <LinkItem
                          icon={<PackageOpen />}
                          title="Productos"
                          href="/administrador/tables/Catalogo/producto"
                        />
                        <LinkItem
                          icon={<ClipboardPlus />}
                          title="Medida Productos"
                          href="/administrador/tables/Catalogo/medidaProducto"
                        />
                        <LinkItem
                          icon={<ClipboardMinus/>}
                          title="Medida Ventas"
                          href="/administrador/tables/Catalogo/medidaVenta"
                        />
                        <LinkItem
                          icon={<Palette />}
                          title="Colores"
                          href="/administrador/tables/Catalogo/color"
                        />
                        <LinkItem
                          icon={<Weight />} 
                          title="Peso"
                          href="/administrador/tables/Catalogo/peso"
                        />
                        <LinkItem
                          icon={<Ruler />}
                          title="Unidades de medida"
                          href="/administrador/tables/Catalogo/unidadMedida"
                        />
                        <LinkItem
                          icon={<DollarSign />}
                          title="Precio"
                          href="/administrador/tables/Catalogo/precioVenta"
                        />
                      </ExpandMenu>
                    )}
                  </ExpandMenu>
                </li>
              )}
              {/* <!-- Menu Venta --> */}
              {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Gestión de Ventas') && 
                <>
                <li>
                  <ExpandMenu
                    name="Venta"
                    icon={<ShoppingCart className="  h-6 w-6 hover:text-white" />}
                  >
                    <LinkItem
                      icon={<ClipboardList />}
                      title="Pedidos"
                      href="/administrador/tables/ventas/venta"
                    />
                    {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Gestión de PQRS') && 
                      <ExpandMenu
                        name="PQRS"
                        icon={<FileQuestion className="  h-6 w-6 hover:text-white" />}
                      >
                        <LinkItem
                          icon={<ClipboardList />}
                          title="Listado"
                          href="/administrador/tables/Catalogo/categoria"
                        />
                      </ExpandMenu>
                    )}
                  </ExpandMenu>
                </li> 
                </>
              )}
              {/* <!-- Menu Envio --> */}
              {(rol && rol.permisos.some(permiso => permiso.nombrePermiso === 'Envíos') && 
                <li>
                  <ExpandMenu
                    name="Envio"
                    icon={<PackageCheck className="  h-6 w-6 hover:text-white" />}
                  >
                    <LinkItem
                      icon={<ClipboardList />}
                      title="Listado"
                      href="/administrador/tables/envios"
                    />
                  </ExpandMenu>
                </li>
              )}
              {/* <!-- Menu Item Calendar --> */}
              <li>
                <LinkItem
                  title="Imagenes"
                  href="/administrador/tables/img"
                  icon={<Images className="h-6 w-6" />}
                ></LinkItem>
              </li>
              {/* <!-- Menu Item Calendar --> */}
              <li>
                <LinkItem
                  title="Calendar"
                  href="/administrador/calendar"
                  icon={<Calendar className="h-6 w-6" />}
                ></LinkItem>
              </li>

              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
