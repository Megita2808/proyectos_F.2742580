// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { Column } from "react-table";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import Modal, { setAppElement } from "react-modal";
// import Swal from 'sweetalert2';

// import { DataRowUsuario, dataRol } from '@/components/administrador/tablas/tiposFilas/usuario';

// import Table from '@/components/administrador/tablas/tabla/formatoTabla';
// import StatusBoton from '@/components/administrador/tablas/catalogo/estado/estado';

// import EditarUsuario from '@/service/api/usuarios/clientes/EditarCliente';
// import EliminarUsuario from '@/service/api/usuarios/clientes/EliminarCliente';
// import AgregarUsuario from '@/service/api/usuarios/clientes/AgregaCliente';

// import { getRoles } from "@/service/api/configuracion/rol/TodoRol";

// import {
//   Pencil,
//   Trash2,
//   Eye
// } from "lucide-react";

// Modal.setAppElement('#root');

// declare module "jspdf" {
//   interface jsPDF {
//     autoTable: (options: any) => void;
//   }
// }

// interface DataTableProps {
//   data: DataRowUsuario[];
//   setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isModalVisualizar, setIsModalVisualizar] = useState(false);
//   const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
//   const [modalData, setModalData] = useState<{ id: string; NombreUsuario: string; CorreoUsuario: string; TelefonoUsuario: string; RolUnico: dataRol;} | null>(null);
  
//   const [NombreUsuario, setNombreUsuario] = useState<string>('');
//   const [PasswordUsuario, setPasswordUsuario] = useState<string>('');
//   const [CorreoUsuario, setCorreoUsuario] = useState<string>('');
//   const [TelefonoUsuario, setTelefonoUsuario] = useState<string>('');
//   const [RolUnico, setRol] = useState<dataRol>({_id: '', nombreRol: '', extraPorcentaje: 0});
//   const [allRoles, setAllRoles] = useState<dataRol[]>([]);
//   const [perPage] = useState(3);

//   const [currentPage, setCurrentPage] = useState(1);
//   const rolesPorPagina = 5; 

//   const totalPages = Math.ceil(allRoles.length / perPage);

//   const indexOfLastRol = currentPage * perPage;

//   const startIndex = (currentPage - 1) * rolesPorPagina;
//   const currentRoles = allRoles.slice(startIndex, startIndex + rolesPorPagina);

//   const indiceInicio = (currentPage - 1) * rolesPorPagina;
//   const rolActuales = allRoles.slice(indiceInicio, indiceInicio + rolesPorPagina);

//   const columns: Column<DataRowUsuario>[] = useMemo(
//     () => [
//       { Header: "ID", accessor: "col1" },
//       { Header: "Nombre", accessor: "nombre" },
//       { Header: "Correo", accessor: "correo" },
//       { Header: "Teléfono", accessor: "telefono" },
//       {
//         Header: "Visualizar Rol",
//         Cell: ({ row }) => (
//           <button onClick={() => abrirModalVisualizar(row.original.rol)}>
//             <Eye className="h-6 w-6 hover:text-blue-600" />
//           </button>
//         ),
//       },
//       {
//         Header: "Estado",
//         accessor: "enabled",
//         Cell: ({ value, row }) => (
//           <div style={{ display: 'flex', alignItems: 'center' }}> 
//             <StatusBoton isEnabled={value} id={row.original.identificador} modulo="usuario"/>
//           </div>
//         ),
//       },
//       {
//         Header: "Editar",
//         Cell: ({ row }) => (
//           <button onClick={() => openModal(row.original.identificador, row.original.nombre, row.original.correo, row.original.telefono, row.original.rol)}>
//             <Pencil className="h-6 w-6 hover:text-green-600" />
//           </button>
//         ),
//       },
//       {
//         Header: "Eliminar",
//         Cell: ({ row }) => (
//           <button onClick={() => eliminarUsuario(row.original.identificador)}>
//             <Trash2 className="h-6 w-6 hover:text-red-600" />
//           </button>
//         ),
//       }
//     ],
//     []
//   );

//   const openModal = (identificador: string, nombre: string, correo: string, telefono: string, rolData: dataRol) => {
//     setModalData({id: identificador, NombreUsuario: nombre, CorreoUsuario: correo, TelefonoUsuario: telefono, RolUnico: rolData});
//     setIsModalOpen(true)
//   };

//   const closeModal = () => {
//     setNombreUsuario('');
//     setCorreoUsuario('');
//     setTelefonoUsuario('');
//     setRol({_id: '', nombreRol: '', extraPorcentaje: 0});
//     setIsModalOpen(false);
//   };

//   const cerrarModalVisualizar = () => {
//     setNombreUsuario('');
//     setCorreoUsuario('');
//     setTelefonoUsuario('');
//     setRol({_id: '', nombreRol: '', extraPorcentaje: 0});
//     setIsModalVisualizar(false);
//   };

//   const abrirModalAgregar = () => {
//     setIsModalAgregar(true);
//   };

//   const cerrarModalAgregar = () => {
//     setNombreUsuario('');
//     setCorreoUsuario('');
//     setTelefonoUsuario('');
//     setRol({_id: '', nombreRol: '', extraPorcentaje: 0});
//     setIsModalAgregar(false);
//   };

//   const abrirModalVisualizar = async (datosRoles: dataRol) => {
//     setRol(datosRoles)
//     setCurrentPage(1);
//     setIsModalVisualizar(true);
//   };

//   const eliminarUsuario = async (identificador: string) => {
//     if (identificador) {
//       try {
//         const response = await EliminarUsuario(identificador); 
//         if (response) {
//           Swal.fire({
//             title: '¡Exitoso!',
//             text: '¡Rol eliminado exitosamente!',
//             icon: 'success',
//             timerProgressBar: true,
//             timer: 1500,
//             showConfirmButton: false,
//           });
//           setRefreshData(true); 
//         } else {
//           Swal.fire({
//             title: '¡Error!',
//             text: '¡El rol no pudo ser eliminado!',
//             icon: 'error',
//             timerProgressBar: true,
//             timer: 1500,
//             showConfirmButton: false,
//           });
//         }
        
//       } catch (error) {
//         Swal.fire({
//           title: '¡Error!',
//           text: '¡La solicitud no pudo ser enviada!',
//           icon: 'error',
//           timerProgressBar: true,
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     } else {
//       Swal.fire({
//         title: '¡Error!',
//         text: '¡El identificador no se reconoce!',
//         icon: 'error',
//         timerProgressBar: true,
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     }
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     const columnsToInclude = [0, 1, 2];

//     const tableColumn = columns
//       .filter((_, index) => columnsToInclude.includes(index))
//       .map((col) => col.Header as string);
//     const tableRows = data.map((row) => {
//       const rowData = Object.values(row);
//       if (rowData[3] == true) {
//         rowData[2] = "Habilitado"; 
//       } else {
//         rowData[2] = "Inhabilitado";
//       }

//       rowData.splice(3, 1);
  
//       return rowData;
//     });
  
//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//     });
  
//     doc.save("table.pdf");
//   };

//   const handlePrevPage = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   const handleRolClick = (rol: dataRol) => {
//     setRol({_id: rol._id, nombreRol: rol.nombreRol, extraPorcentaje: rol.extraPorcentaje});
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const handlePaginaSiguiente = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const handlePaginaAnterior = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const roles = await getRoles();
//         const filteredRoles = roles.filter(
//           (rol) => rol.nombreRol !== 'Administrador' && rol.nombreRol === 'Empleado'
//         );
//         setAllRoles(filteredRoles);
//       } catch (error) {
//         console.error('Error al obtener los roles:', error);
//       }
//     };
  
//     fetchRoles();
//   }, []);
  
//   return (
//     <div style={{ padding: "20px" }}>
//       <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar empleado</button>
//       <button
//         className="botonPDF"
//         onClick={generatePDF}
//       >
//         Generate PDF
//       </button>

//       <Table<DataRowUsuario> columns={columns} data={data} setRefreshData={() => {}}/>

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         contentLabel="Edit Modal"
//         className="ModalDashboard"
//         overlayClassName="Overlay"
//       >
//         <div className="ModalDashboard">
//           <div className="ModalContentSinImagen">
//             <form className="formularioAgregar" onSubmit={async (e) => {
//                 e.preventDefault();

//                 const response = await EditarUsuario(modalData!.id, modalData!.NombreUsuario !== NombreUsuario ? modalData!.NombreUsuario : NombreUsuario , modalData!.CorreoUsuario !== CorreoUsuario ? modalData!.CorreoUsuario : CorreoUsuario , modalData!.TelefonoUsuario !== TelefonoUsuario ?  modalData!.TelefonoUsuario: TelefonoUsuario, modalData!.RolUnico._id !== RolUnico._id ?  modalData!.RolUnico._id : RolUnico._id); 
//                 if (response) {
//                   Swal.fire({
//                     title: '¡Exitoso!',
//                     text: '¡Rol actualizado exitosamente!',
//                     icon: 'success',
//                     timerProgressBar: true,
//                     timer: 1500,
//                     showConfirmButton: false,
//                   });
//                   setRefreshData(true); 
//                   closeModal();
//                 } else {
//                   Swal.fire({
//                     title: '¡Error!',
//                     text: '¡El rol no pudo ser actualizado!',
//                     icon: 'error',
//                     timerProgressBar: true,
//                     timer: 1500,
//                     showConfirmButton: false,
//                   });
//                 }
//               }}>
//               <div>
//                 <h2 className="titleSinFondoModal">Editar Empleado</h2>
//                 <label htmlFor="nombreRol" className="LabelModal">Nombre empleado:</label>
//                 <input
//                   id="nombreRol"
//                   value={modalData?.NombreUsuario || NombreUsuario}
//                   onChange={(e) => {
//                     if (modalData) {
//                       setModalData({ ...modalData, NombreUsuario: e.target.value });
//                     }
//                     setNombreUsuario(e.target.value)
//                   }}
//                   className="inputEditarForm"
//                 />
//                 <label htmlFor="nombreRol" className="LabelModal">Correo</label>
//                 <input
//                   id="nombreRol"
//                   value={modalData?.CorreoUsuario || CorreoUsuario}
//                   onChange={(e) => {
//                     if (modalData) {
//                       setModalData({ ...modalData, CorreoUsuario: e.target.value });
//                     }
//                     setCorreoUsuario(e.target.value)
//                   }}
//                   className="inputEditarForm"
//                 />
//                 <label htmlFor="nombreRol" className="LabelModal">Teléfono</label>
//                 <input
//                   id="nombreRol"
//                   value={modalData?.TelefonoUsuario || TelefonoUsuario}
//                   onChange={(e) => {
//                     if (modalData) {
//                       setModalData({ ...modalData, TelefonoUsuario: e.target.value });
//                     }
//                     setTelefonoUsuario(e.target.value)
//                   }}
//                   className="inputEditarForm"
//                 />
//                   <div style={{ display: 'flex', gap: '10px', marginTop:'10px' }}>
//                     <button type="submit" className="botonEditarModal">
//                     Actualizar
//                     </button>
//                     <button type="button" onClick={closeModal} className="CerrarModalBotonGeneral">
//                       Cerrar
//                     </button>
//                   </div>
//               </div>
//             </form>
//           </div>
          
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '700px' }}>
//             <div style={{ background: 'white', padding: '20px', borderRadius: '7px', width: '100%' }}>
//               <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }} className="titleSinFondoModal">
//                 Roles:
//               </h3>
//               <div style={{ padding: '10px', gap: '10px' }}>
//                 {allRoles.map((rol) => (
//                   <div
//                     key={rol._id}
//                     onClick={() => handleRolClick(rol)}
//                     className={`permiso-item ${allRoles.some((p) => p._id === rol._id) ? 'selected' : ''}`}
//                     style={{
//                       cursor: 'pointer',
//                       padding: '10px',
//                       marginBottom: '10px',
//                       border: '1px solid #ccc',
//                       borderRadius: '7px',
//                       backgroundColor: allRoles.some((p) => p._id === rol._id) ? '#007bff' : 'white',
//                       color: allRoles.some((p) => p._id === rol._id) ? 'white' : 'black',
//                     }}
//                   >
//                     {rol.nombreRol}: {rol.extraPorcentaje}
//                   </div>
//                 ))}
//                 {allRoles.length > 5 && (
//                   <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
//                     <button onClick={handlePaginaAnterior} disabled={currentPage === 1}>
//                       Anterior
//                     </button>
//                     <span style={{ alignSelf: 'center' }}>
//                       {currentPage} de {totalPages}
//                     </span>
//                     <button onClick={handlePaginaSiguiente} disabled={currentPage === totalPages}>
//                       Siguiente
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//         </div>
//       </Modal>

//       <Modal
//         isOpen={ModalAgregarAbrir}
//         onRequestClose={cerrarModalAgregar}
//         contentLabel="Agregar Rol"
//         className="ModalDashboard"
//         overlayClassName="Overlay"
//       >
//         <div className="ModalDashboard">
//           <div className="ModalContentSinImagen">
//             <form className="formularioAgregar" onSubmit={async (e) => {
//                 e.preventDefault();
//                 const response = await AgregarUsuario(NombreUsuario,PasswordUsuario, CorreoUsuario, TelefonoUsuario, RolUnico._id); 
//                 if (response) {
//                   Swal.fire({
//                     title: '¡Exitoso!',
//                     text: 'Usuario agregado exitosamente!',
//                     icon: 'success',
//                     timerProgressBar: true,
//                     timer: 1500,
//                     showConfirmButton: false,
//                   });
//                   setRefreshData(true); 
//                   cerrarModalAgregar();
//                 } else {
//                   Swal.fire({
//                     title: '¡Error!',
//                     text: '¡El usuario no pudo ser agregado!',
//                     icon: 'error',
//                     timerProgressBar: true,
//                     timer: 1500,
//                     showConfirmButton: false,
//                   });
//                 }
//               }}>
//               <div>
//                 <h2 className="titleSinFondoModal">Agregar</h2>
//                 <label htmlFor="nombreUsuario" className="LabelModal">Nombre</label>
//                 <input
//                   id="nombreUsuario"
//                   value={NombreUsuario}
//                   onChange={(e) => setNombreUsuario(e.target.value)}
//                   className="inputEditarForm"
//                 />
//                 <label htmlFor="passwordUsuario" className="LabelModal">Password</label>
//                 <input
//                   id="passwordUsuario"
//                   value={PasswordUsuario}
//                   onChange={(e) => setPasswordUsuario(e.target.value)}
//                   className="inputEditarForm"
//                 />
//                 <label htmlFor="correoUsuario" className="LabelModal">Correo</label>
//                 <input
//                   id="correoUsuario"
//                   value={CorreoUsuario}
//                   onChange={(e) => setCorreoUsuario(e.target.value)}
//                   className="inputEditarForm"
//                 />
//                 <label htmlFor="telefonoUsuario" className="LabelModal">Telefono</label>
//                 <input
//                   id="telefonoUsuario"
//                   value={TelefonoUsuario}
//                   onChange={(e) => setTelefonoUsuario(e.target.value)}
//                   className="inputEditarForm"
//                 />
//                   <div style={{ display: 'flex', gap: '10px', marginTop:'10px' }}>
//                     <button type="submit" className="botonEditarModal">
//                     Agregar
//                     </button>
//                     <button type="button" onClick={cerrarModalAgregar} className="CerrarModalBotonGeneral">
//                       Cerrar
//                     </button>
//                   </div>
//                 </div>
//             </form>
//           </div>

//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '700px' }}>
//             <div style={{ background: 'white', padding: '20px', borderRadius: '7px', width: '100%' }}>
//                 <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }} className="titleSinFondoModal">
//                 Roles:
//                 </h3>
//                 <div style={{ padding: '10px', gap: '10px' }}>
//                 {currentRoles.map((rol) => (
//                     <div
//                     key={rol._id}
//                     onClick={() => handleRolClick(rol)}
//                     className={`rol-item ${rol._id === RolUnico._id ? 'selected' : ''}`}
//                     style={{
//                         cursor: 'pointer',
//                         padding: '10px',
//                         marginBottom: '10px',
//                         border: '1px solid #ccc',
//                         borderRadius: '7px',
//                         backgroundColor: rol._id === RolUnico._id ? '#007bff' : 'white',
//                         color: rol._id === RolUnico._id ? 'white' : 'black',
//                     }}
//                     >
//                     {rol.nombreRol}: {rol.extraPorcentaje}
//                     </div>
//                 ))}
//                 {currentRoles.length > 5 && (
//                     <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
//                     <button onClick={handlePrevPage} disabled={currentPage === 1}>
//                         Anterior
//                     </button>
//                     <span style={{ alignSelf: 'center' }}>{currentPage} de {totalPages}</span>
//                     <button onClick={handleNextPage} disabled={currentPage === totalPages}>
//                         Siguiente
//                     </button>
//                     </div>
//                 )}
//                 </div>
//             </div>
//          </div>

//         </div>
//       </Modal>

//       <Modal
//         isOpen={isModalVisualizar}
//         onRequestClose={cerrarModalVisualizar}
//         contentLabel="Visualizar Permisos"
//         className="ModalRoles"
//         overlayClassName="Overlay"
//         style={{
//           content: {
//             width: '250px',
//             height: 'auto',
//             margin: 'auto',
//             padding: '20px',
//             borderRadius: '10px',
//             backgroundColor: '#fff',
//             border: '1px solid #ccc',
//           }
//         }}
//       >
//         <div className="ModalContentRoles">
//           <h2>Rol activo</h2>
//           <div  style={{width:'80%'}}>
//             <div key={RolUnico._id} className="border p-2 rounded">
//             <strong>{RolUnico.nombreRol}</strong>
//             {/* <p>Cobro extra: {RolUnico.extraPorcentaje*100}%</p> */}
//             </div>
//           </div>
//           <button onClick={cerrarModalVisualizar} className="CerrarModalBotonGeneral" style={{marginTop:'10px'}}>Cerrar</button>
//         </div>
//       </Modal>

//     </div>
//   );
// };

// export default DataTable;
