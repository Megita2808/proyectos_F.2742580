"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { checkToken } from "@/api/validations/check_cookie";
import { Usuario } from "@/types/admin/Usuario";
import { logOut } from "@/utils/validationsTokens";
import Swal from "sweetalert2";
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { fetchUserById } from "@/api/fetchs/get_usuarios";
import { useAuth } from "@/context/AuthContext";

interface DropdownUserProps {
  dataUser: Usuario;
}

interface ClientData {
  id_user: number;
  names: string;
  lastnames: string;
  dni: string;
  mail: string;
  phone_number: string;
}

const DropdownUser: React.FC<{dataUser : Usuario | undefined}> = ({dataUser}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { loadPermissions, setLoadPermissions } = useAuth();
  const [clientData, setClientData] = useState<any>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // const fetchClientData = async () => {
  //   setLoading(true);
  //   const { result, data } = await checkToken();

  //   if (result && data) {
  //     const userData = await fetchUserById(data.id_user); 
  //     const dataClient = {
  //       id_user: data.id_user,
  //       names: userData.names,
  //       lastnames: userData.lastnames,
  //       dni: userData.dni,
  //       mail: userData.mail,
  //       phone_number: userData.phone_number,
  //     };
  //     setClientData(dataClient);
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "No se pudo cargar los datos del perfil.",
  //     });
  //     router.push("/login");
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    setClientData(dataUser);
    if (dataUser?.accessDashboard == true) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const logOutHandle = async() => {
    const response = await logOut();

    if(response) {
      let timerInterval: number | NodeJS.Timeout;
      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: "Cerrando Sesión",
        html: "Redirigiendo a la página principal en <b>3</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 3;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      setLoadPermissions(!loadPermissions);
    }
    router.push("/inicio")
    
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          <Avatar size="large" icon={<UserOutlined />} />
        </span>

        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6 w-[200px]">
          <span className="hidden lg:block">
            {loading ? (null) : `${clientData.names} ${clientData.lastnames}`}
          </span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen && "rotate-180"}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
              fill=""
            />
          </svg>
        </span>
      </Link>

      {/* <!-- Dropdown Star --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex min-w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-12 w-12 rounded-full">
              <Avatar size="large" icon={<UserOutlined />} />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
            </span>
            <span className="block">
              <span className="block font-medium text-dark dark:text-white">
              {loading ? (null) : `${clientData.names} ${clientData.lastnames}`}
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
              {loading ? (null) : `${clientData.mail}`}
              </span>
            </span>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href="/perfil"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg width="18px" height="24px" viewBox="0 0 24 24" fill="#5750f1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" /* stroke="#ffffff"  */ strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                Ver Perfil
              </Link>
            </li>

            <li>
              <Link
                href="/mis_reservas"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg width="18px" height="24px" viewBox="0 0 24.00 24.00" fill="#5750f1" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)" /* stroke="#000000" */ strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="m7.33755 4.30894c.30652-1.18429 1.38234-2.05894 2.66245-2.05894h4c1.2801 0 2.3559.87465 2.6624 2.05894 1.5999.28654 2.8416 1.57693 3.0555 3.20159.0322.24459.0322.52292.0321.93158v.00003.05786 7.7.0321c0 .8129 0 1.4685-.0434 1.9994-.0446.5466-.139 1.0267-.3653 1.471-.3596.7056-.9332 1.2793-1.6388 1.6388-.4443.2263-.9244.3207-1.471.3653-.5309.0434-1.1865.0434-1.9994.0434h-.0321-4.4-.03213c-.81283 0-1.46844 0-1.99934-.0434-.54664-.0446-1.02678-.139-1.471-.3653-.7056-.3595-1.27928-.9332-1.63881-1.6388-.22634-.4443-.3207-.9244-.36536-1.471-.04338-.5309-.04337-1.1866-.04336-1.9994v-.0321-7.7l-.00001-.05786c-.00007-.40868-.00011-.68702.03209-.93161.21389-1.62466 1.45558-2.91505 3.05547-3.20159zm.04216 1.52812c-.85075.24354-1.49225.97131-1.61046 1.86926-.01764.13392-.01925.30542-.01925.79368v7.7c0 .8525.00058 1.4467.03838 1.9093.03708.4539.10621.7147.20685.9122.21572.4233.55992.7675.98329.9833.19752.1006.45828.1697.91216.2068.46263.0378 1.05686.0384 1.90932.0384h4.4c.8525 0 1.4467-.0006 1.9093-.0384.4539-.0371.7147-.1062.9122-.2068.4233-.2158.7675-.56.9833-.9833.1006-.1975.1697-.4583.2068-.9122.0378-.4626.0384-1.0568.0384-1.9093v-7.7c0-.48826-.0016-.65976-.0193-.79368-.1182-.89795-.7597-1.62572-1.6104-1.86926-.3541 1.10947-1.3934 1.91294-2.6203 1.91294h-4c-1.22691 0-2.26617-.80347-2.62029-1.91294zm2.62029-2.08706c-.69036 0-1.25.55964-1.25 1.25s.55964 1.25 1.25 1.25h4c.6904 0 1.25-.55964 1.25-1.25s-.5596-1.25-1.25-1.25zm-2.75 7.25c0-.4142.33578-.75.75-.75h8c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-8c-.41422 0-.75-.3358-.75-.75zm.75 2.25c-.41422 0-.75.3358-.75.75s.33578.75.75.75h8c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75zm-.75 3.75c0-.4142.33578-.75.75-.75h6c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-6c-.41422 0-.75-.3358-.75-.75z" fill="#5750f1" fill-rule="evenodd"></path></g></svg>
                Mis reservas
              </Link>
            </li>
            {isAdmin && (<li>
              <Link
                href="/admin"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg width="18px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_1237_357558)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 7.5C9.5146 7.5 7.49988 9.51472 7.49988 12C7.49988 14.4853 9.5146 16.5 11.9999 16.5C14.4852 16.5 16.4999 14.4853 16.4999 12C16.4999 9.51472 14.4852 7.5 11.9999 7.5ZM9.49988 12C9.49988 10.6193 10.6192 9.5 11.9999 9.5C13.3806 9.5 14.4999 10.6193 14.4999 12C14.4999 13.3807 13.3806 14.5 11.9999 14.5C10.6192 14.5 9.49988 13.3807 9.49988 12Z" fill="#5750f1"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 2.5C7.80917 2.5 4.80627 4.84327 2.90279 7.0685C1.94654 8.18638 1.24425 9.29981 0.780854 10.1325C0.548544 10.55 0.374643 10.8998 0.257542 11.1484C0.198955 11.2727 0.154474 11.372 0.123909 11.4419C0.108623 11.4769 0.0968071 11.5046 0.0884377 11.5245L0.0784618 11.5483L0.0754044 11.5557L0.0743572 11.5583L0.0739539 11.5593L-0.0742188 11.9233L0.0645713 12.291L0.0649583 12.292L0.0659593 12.2947L0.0688703 12.3023L0.0783443 12.3266C0.0862884 12.3469 0.0975008 12.3751 0.112024 12.4107C0.141064 12.482 0.183381 12.583 0.23932 12.7095C0.351123 12.9623 0.517779 13.318 0.742125 13.7424C1.1896 14.5889 1.87305 15.7209 2.8177 16.8577C4.70134 19.1243 7.7068 21.5 11.9998 21.5C16.2929 21.5 19.2983 19.1243 21.182 16.8577C22.1266 15.7209 22.8101 14.5889 23.2576 13.7424C23.4819 13.318 23.6486 12.9623 23.7604 12.7095C23.8163 12.583 23.8586 12.482 23.8877 12.4107C23.9022 12.3751 23.9134 12.3469 23.9213 12.3266L23.9308 12.3023L23.9337 12.2947L23.9347 12.292L23.9351 12.291L24.0739 11.9233L23.9257 11.5593L23.9243 11.5557L23.9212 11.5483L23.9112 11.5245C23.9029 11.5046 23.8911 11.4769 23.8758 11.4419C23.8452 11.372 23.8007 11.2727 23.7421 11.1484C23.625 10.8998 23.4511 10.55 23.2188 10.1325C22.7554 9.29981 22.0531 8.18638 21.0969 7.0685C19.1934 4.84327 16.1905 2.5 11.9998 2.5ZM22.9998 11.9371C23.9354 12.2902 23.9351 12.291 23.9351 12.291L22.9998 11.9371ZM23.9257 11.5593C23.9257 11.5593 23.926 11.5601 22.9998 11.9371L23.9257 11.5593ZM0.99984 11.9371C0.0736306 11.5601 0.0739539 11.5593 0.0739539 11.5593L0.99984 11.9371ZM0.0645713 12.291C0.0645713 12.291 0.0642597 12.2902 0.99984 11.9371L0.0645713 12.291ZM2.51028 12.8077C2.32519 12.4576 2.18591 12.1632 2.09065 11.9504C2.19077 11.7404 2.33642 11.4501 2.52847 11.105C2.94543 10.3558 3.57456 9.35995 4.4226 8.36857C6.12769 6.37527 8.62479 4.5 11.9998 4.5C15.3749 4.5 17.872 6.37527 19.5771 8.36857C20.4251 9.35995 21.0542 10.3558 21.4712 11.105C21.6633 11.4501 21.8089 11.7404 21.909 11.9504C21.8138 12.1632 21.6745 12.4576 21.4894 12.8077C21.0881 13.5667 20.4781 14.5754 19.6438 15.5794C17.9694 17.5942 15.4749 19.5 11.9998 19.5C8.52477 19.5 6.03023 17.5942 4.3559 15.5794C3.52156 14.5754 2.91153 13.5667 2.51028 12.8077Z" fill="#5750f1"></path> </g> <defs> <clipPath id="clip0_1237_357558"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
                Ver como Administrador
              </Link>
            </li>)}
          </ul>
          <div className="p-2.5">
            <button onClick={logOutHandle} className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-semibold text-dark-4 duration-300 ease-in-out hover:bg-red-300 hover:text-red-600 dark:text-dark-6 dark:hover:bg-red-300 dark:hover:text-red-600 lg:text-base">
            <svg width="18px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
