/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import DatePicker from "react-datepicker";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { motion } from 'framer-motion';
import Modal from "react-modal";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';

import AgregarEnvio from '@/service/api/envios/agregarEnvio';
import FormularioDireccion from "./microFormularioDireccion";
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';
import { getLocacionesDelUsuario } from '@/service/api/ubicacion/todoLocacionUsuarioUnico';
import { Eraser, Undo2 } from "lucide-react";
import Link from "next/link";
import { addDays, setHours, setMinutes, getDay } from 'date-fns';

interface MunicipioPorDepartamento {
  codigoDANEDepartamento: string;
  nombreDepartamento: string;
  municipios: string[];
}

interface RegionAgrupada {
  nombreRegion: string;
  departamentos: MunicipioPorDepartamento[];
}

interface Coordenadas {
  latitud: number;
  longitud: number;
}

interface Locacion {
  departamento: string;
  ciudad: string;
  locacion: string;
  coordenadas: Coordenadas;
  identificadorLocacion: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const libraries: ("places")[] = ["places"];

const Envio: React.FC = () => {
  const router = useRouter();

  const [isSelecting, setIsSelecting] = useState(false);
  const userName = useSelector((state: RootState) => state.user.name);
  const carrito = useSelector((state: RootState) => state.carrito.carrito);
  const [totalCarrito, setTotalCarrito] = useState<number>(0);
  const esDomingo = (date: Date) => date.getDay() !== 0;

  const [TipoLocacion, setTipoLocacion] = useState<string>('');
  const [DatosLocacionesCliente, setDatosLocacionesCliente] = useState<Locacion[]>([]);
  const [DatoLocacionCliente, setDatoLocacionCliente] = useState<Locacion | null>(null);
  const [TipoDireccion, setTipoDireccion] = useState<string>('');
  const [TipoEnvio, setTipoEnvio] = useState<string>('');
  const [direccionGuardada, setDireccionGuardada] = useState<any | null>(null);
  const [editando, setEditando] = useState(false);
  const [Fecha, setStarFecha] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [modalFormularioDireccion, setModalFormularioDireccion] = useState<boolean>(false);
  const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(null);
  const [puntoPartidaRef, setpuntoPartidaRef] = useState<google.maps.LatLngLiteral | null>(null);
  const limiteDistancia = 70;

  const [Departamentos, setDepartamentos] = useState<RegionAgrupada[]>([]);
  const [RegionSeleccionadaNombre, setRegionSeleccionadaNombre] = useState<string>('');
  const [DepartamentoSeleccionado, setDepartamentoSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  const [MunicipioSeleccionado, setMunicipioSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCM0IAKKlIGcBq0T9dU4UphG49CP_napAI",
    libraries,
  });
  
  const closeModal = () => setModalOpen(false);

  const filtroTiempo = (date: Date) => {
    const day = getDay(date);
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (day >= 1 && day <= 5) { 
      return hour >= 7 && hour <= 17;
    } else if (day === 6) { 
      return (hour > 7 || (hour === 7 && minute >= 30)) && hour <= 11;
    }
    return false;
  };

  const obtenerPrimeraHoraDisponible = (date: Date) => {
    const day = getDay(date);
    let primeraHora;

    if (day >= 1 && day <= 5) {
      primeraHora = setHours(setMinutes(date, 0), 7);
    } else if (day === 6) {
      primeraHora = setHours(setMinutes(date, 30), 7);
    }

    return primeraHora;
  };

  const redondearCoordenadas = (coord: number, decimales: number = 6) => {
    return parseFloat(coord.toFixed(decimales));
  };

  const manejarCambioFecha = (date: Date | null) => {
    if (date) {
      const horasSeleccionadas = date.getHours();
      const minutosSeleccionados = date.getMinutes();
  
      if ((horasSeleccionadas === 0 && minutosSeleccionados === 0) || date.getDay() !== Fecha?.getDay()) {
        const primeraHora = obtenerPrimeraHoraDisponible(date);
        setStarFecha(primeraHora || date);
      } else {
        setStarFecha(date);
      }
    } else {
      setStarFecha(null);
    }
  };
  
  const calcularDistanciaEnMetros = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distancia = R * c;
  
    return distancia;
  };

  const handleSubmit = async () => {
    if (Fecha && (typeof direccionGuardada === 'object' && selected) &&  TipoEnvio === 'enviar') {
      var direccionCompleta = `${direccionGuardada.tipoVia} ${direccionGuardada.numeroVia} ${direccionGuardada.prefijoVia} ${direccionGuardada.cardinalidadVia} # ${direccionGuardada.numeroViaCrl} ${direccionGuardada.prefijoViaCrl} ${direccionGuardada.cardinalidadViaCrl} - ${direccionGuardada.numeroPlaca}`;
      direccionCompleta = direccionCompleta.replace(/\s+/g, ' ').trim();
      const response = await AgregarEnvio(Fecha, DatoLocacionCliente !== null? DatoLocacionCliente.identificadorLocacion : direccionCompleta, selected, TipoEnvio, DatoLocacionCliente !== null? DatoLocacionCliente.identificadorLocacion : DepartamentoSeleccionado.nombre, DatoLocacionCliente !== null? DatoLocacionCliente.identificadorLocacion : MunicipioSeleccionado.nombre);
      if (response && response.status === 200){
        Swal.fire({
          title: '¡Exitoso!',
          text: '¡Venta generada exitosamente!',
          icon: 'success',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        router.push('/cliente/principal');
      }else{
        Swal.fire({
          title: '¡Error!',
          text: '¡La venta no pudo ser generada!',
          icon: 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } else if(DatoLocacionCliente &&  DatoLocacionCliente.identificadorLocacion !== '' && Fecha && TipoEnvio === 'enviar'){
      const response = await AgregarEnvio(
        Fecha, 
        DatoLocacionCliente.identificadorLocacion, 
        undefined,
        TipoEnvio,
        undefined,
        undefined
      );
      if (response && response.status === 200){
        Swal.fire({
          title: '¡Exitoso!',
          text: '¡Venta generada exitosamente!',
          icon: 'success',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        router.push('/cliente/principal');
      }else{
        Swal.fire({
          title: '¡Error!',
          text: '¡La venta no pudo ser generada!',
          icon: 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } else if (Fecha && TipoEnvio === 'recoger'){
      const response = await AgregarEnvio(Fecha, '', undefined, TipoEnvio, undefined, undefined);
      if (response && response.status === 200){
        Swal.fire({
          title: '¡Exitoso!',
          text: '¡Venta generada exitosamente!',
          icon: 'success',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        router.push('/cliente/principal');
      }else{
        Swal.fire({
          title: '¡Error!',
          text: '¡La venta no pudo ser generada!',
          icon: 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleEditAddress = () => {
    setEditando(true);
    setModalFormularioDireccion(true);
  };

  const handleClearAddress = () => {
    setDireccionGuardada(null);
    setSelected(null);
  };

  const abrirFormularioDireccion = () => {
    setModalFormularioDireccion(true);
  };

  const limpiarDato = () => {
    setTipoLocacion('');
    setTipoEnvio('');
    setDatoLocacionCliente(null);
    setStarFecha(null);
    setSelected(null);
    setModalFormularioDireccion(false);
    setEditando(false);
    setDireccionGuardada(null);
    setRegionSeleccionadaNombre('');
    setDepartamentoSeleccionado({ identificador: '', nombre: '' });
    setMunicipioSeleccionado({ identificador: '', nombre: '' });
  };

  const cerrarFormularioDireccion = () => {
    setModalFormularioDireccion(false);
    setEditando(false);
  };

  const obtenerCoordenadasPorDireccion = useCallback(async (direccionDatos: string) => {
    const apiKey = "AIzaSyCM0IAKKlIGcBq0T9dU4UphG49CP_napAI";
    const direccionFormateada = obtenerDireccionFormateada(direccionDatos, DepartamentoSeleccionado, MunicipioSeleccionado);
    try {
      if (direccionFormateada){
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionFormateada)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "OK" && data.results.length > 0) {
          const latLng = {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng,
          };
          setSelected(latLng);
          setpuntoPartidaRef(latLng);
        } else {
          console.error("No se encontraron resultados para la dirección proporcionada.");
        }
      }
      
    } catch (error) {
      console.error("Error obteniendo las coordenadas:", error);
    }
  },[puntoPartidaRef, DepartamentoSeleccionado, MunicipioSeleccionado]);

  const handleAddressSubmit = (data: any, tipoDireccion: string) => {
    const direccionCompleta = `${data.tipoVia} ${data.numeroVia} ${data.prefijoVia} ${data.cardinalidadVia} # ${data.numeroViaCrl} ${data.prefijoViaCrl} ${data.cardinalidadViaCrl} - ${data.numeroPlaca}`;
    setTipoDireccion(tipoDireccion);
    setDireccionGuardada(data);
    setEditando(false);
    obtenerCoordenadasPorDireccion(direccionCompleta);
  };

  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedNombre = e.target.value;
    setRegionSeleccionadaNombre(selectedNombre);
    setDepartamentoSeleccionado({ identificador:'', nombre: '' });
    setMunicipioSeleccionado({ identificador:'', nombre: '' });
  };

  const handleTipoLocacionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedTipo = e.target.value;
    setTipoLocacion(selectedTipo);
    setDatoLocacionCliente(null);
    setSelected(null);
    setModalFormularioDireccion(false);
    setEditando(false);
    setDireccionGuardada(null);
    setRegionSeleccionadaNombre('');
    setDepartamentoSeleccionado({ identificador: '', nombre: '' });
    setMunicipioSeleccionado({ identificador: '', nombre: '' });
  };

  // const handleDepartamentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedIdentificador = e.target.value;
  //   const selectedDepartamentoNombre = e.target.options[e.target.selectedIndex].text;
  //   setDepartamentoSeleccionado({
  //     identificador: selectedIdentificador, 
  //     nombre: selectedDepartamentoNombre
  //   });
  //   setMunicipioSeleccionado({ identificador: '', nombre: '' });
  // };

  const handleDepartamentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departamento = Departamentos
      .find(region => region.nombreRegion === RegionSeleccionadaNombre)
      ?.departamentos.find(dep => dep.codigoDANEDepartamento === e.target.value);
  
    if (departamento) {
      setDepartamentoSeleccionado({ identificador: departamento.codigoDANEDepartamento, nombre: departamento.nombreDepartamento });
    }
  };
  
  const handleMunicipioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIdentificador = e.target.value;
    const selectedMunicipioNombre = e.target.options[e.target.selectedIndex].text;
    setMunicipioSeleccionado({ identificador: selectedIdentificador, nombre: selectedMunicipioNombre });
  };
  
  const handleLocationSelect = (latLng: google.maps.LatLngLiteral) => {
    if (puntoPartidaRef  && latLng){
      const distancia = calcularDistanciaEnMetros(
        redondearCoordenadas(puntoPartidaRef.lat),
        redondearCoordenadas(puntoPartidaRef.lng),
        redondearCoordenadas(latLng.lat),
        redondearCoordenadas(latLng.lng)
      );  
      if (distancia > limiteDistancia) {
        alert(`La nueva ubicación está fuera del límite de ${limiteDistancia} metros`);
        return;
      }
      setSelected(latLng);
    }
  };
  
  const handleLocationSelectUnica = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDatoLocacionCliente(DatosLocacionesCliente.find(locacion => locacion.locacion === e.target.value) || null)
  };

  const handleTipoEnvioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoEnvio(e.target.value);
  };

  const obtenerDepartamentosRegiones = useCallback(async () => {
    obtenerDepartamentos().then((datosDepartamento) => {
      if (datosDepartamento) {
          setDepartamentos(datosDepartamento);
      }
    });
  }, []);

  const calcularPrecioTotal = (precioUnitario: number, peso: number, cantidad:number) => {
    return precioUnitario * peso * cantidad;
  };

  const calcularPrecioTotalSinPeso = (precioUnitario: number, longitud: number, cantidad:number) => {
    return precioUnitario * longitud * cantidad;
  };

  const calcularPrecioTotalModificado = (precioUnitario: number, longitud: number, longitudProducto: number, cantidad:number) => {
    return (precioUnitario * ((longitud * 2) *  longitudProducto)) * cantidad;
  };

  const calcularTotalCarrito = () => {
    return carrito.reduce((total, producto) => {
      const precioUnitario = producto.precioUnitario;
      const cantidad = producto.cantidad;
  
      let precioProducto = 0;
  
      if (typeof producto.longitud === 'number') {
        if (producto.simboloLongitud === "½") {
          precioProducto = calcularPrecioTotalModificado(precioUnitario, producto.longitud, producto.longitudProducto, cantidad);
        } else if (producto.simboloLongitud === "Mt²") {
          if (producto.simboloprecioUnitario === 'Kg'){
            precioProducto = calcularPrecioTotal(precioUnitario, producto.peso, cantidad);
          }else{
            precioProducto = calcularPrecioTotalSinPeso(precioUnitario, producto.longitud, cantidad);
          }
        } else if (producto.peso === 0 && producto.simboloPeso === '') {
          precioProducto = calcularPrecioTotalSinPeso(precioUnitario, producto.longitud, cantidad);
        } else {
          precioProducto = calcularPrecioTotal(precioUnitario, producto.peso, cantidad);
        }
      } else if (typeof producto.longitud === 'object'){
        precioProducto=  calcularPrecioTotalSinPeso(producto.precioUnitario, producto.longitud.parte1 + producto.longitud.parte2,  producto.cantidad);
      } else {
        precioProducto = calcularPrecioTotal(precioUnitario, producto.peso || 0, cantidad);
      }
  
      return total + precioProducto;
    }, 0);
  };

  const obtenerDireccionFormateada = (direccion: string, municipio: any, departamento: any) => {
    const formattedDireccion = direccion.replace(/\s+/g, ' ').trim();
    if (formattedDireccion && municipio?.nombre && departamento?.nombre) {
      const municipio = MunicipioSeleccionado.nombre;
      const departamento = DepartamentoSeleccionado.nombre;
      return `${departamento}, ${municipio}, ${formattedDireccion}`;
    }

    return '';
  };

  useEffect(() => {
    const total = calcularTotalCarrito();
    setTotalCarrito(total);
  }, [carrito]); 

  useEffect(() => {
    const fetchLocaciones = async () => {
      const datos = await getLocacionesDelUsuario();
      setDatosLocacionesCliente(datos);
    };
    
    fetchLocaciones();
  }, []);

  useEffect(() => {
    obtenerDepartamentosRegiones();
  }, []);

  // useEffect(() => {
  //   if (selected && puntoPartidaRef) {
  //     const distancia = calcularDistanciaEnMetros(
  //       puntoPartidaRef.lat,
  //       puntoPartidaRef.lng,
  //       selected.lat,
  //       selected.lng
  //     );
  //   }
  // }, [selected]);

  useEffect(() => {
    if (DatoLocacionCliente) {
      const { departamento, ciudad } = DatoLocacionCliente;

      const regionEncontrada = Departamentos.find(region => 
        region.departamentos.some(dep => dep.nombreDepartamento === departamento)
      );

      if (regionEncontrada) {
        setRegionSeleccionadaNombre(regionEncontrada.nombreRegion);

        const departamentoEncontrado = regionEncontrada.departamentos.find(dep => dep.nombreDepartamento === departamento);

        if (departamentoEncontrado) {
          setDepartamentoSeleccionado({ identificador: departamentoEncontrado.codigoDANEDepartamento, nombre: departamento });

          const municipioEncontrado = departamentoEncontrado.municipios.find(municipio => municipio === ciudad);

          if (municipioEncontrado) {
            setMunicipioSeleccionado({ identificador: municipioEncontrado, nombre: ciudad });
          }
            setDireccionGuardada(DatoLocacionCliente.locacion)
            setSelected({lat : DatoLocacionCliente.coordenadas.latitud, lng : DatoLocacionCliente.coordenadas.longitud})
            setpuntoPartidaRef({lat : DatoLocacionCliente.coordenadas.latitud, lng : DatoLocacionCliente.coordenadas.longitud});
        }
      }
    }
  }, [DatoLocacionCliente, Departamentos]);

  if (loadError) return <div>Error al cargar</div>;
  if (!isLoaded) return <div>Cargando...</div>;

    return (
      <>
        {modalOpen && (
          <div className="fondoEnvioDatos">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              
              <div className="font-semibold mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="text-lg">Datos envio</h2>
                <Link href={'/cliente/principal'} className="">
                  <Undo2 />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                <div>
                  <p><strong>Fecha Envio</strong></p>
                  <DatePicker
                    selected={Fecha}
                    onChange={(date: Date | null) => manejarCambioFecha(date)}
                    placeholderText="Selecciona una fecha y hora"
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    minDate={addDays(new Date(), 6)}
                    filterDate={esDomingo}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Hora"
                    filterTime={filtroTiempo}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>

                { TipoEnvio !== '' && TipoEnvio !== 'recoger' && 
                  (
                    <div>
                      <p><strong>Precio de envío</strong></p>
                      <input
                        type="text"
                        value={
                          totalCarrito <= 1200000
                          ?
                          (totalCarrito * 0.04).toLocaleString('es-CO', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        }) :
                        "Gratis"
                      }
                        placeholder="Precio envio"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                        disabled
                      />
                    </div>
                  )
                }

                <div>
                  <p><strong>Subtotal</strong></p>
                  <input
                    type="text"
                    value={totalCarrito.toLocaleString('es-CO', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    placeholder="Total"
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    disabled
                  />
                </div>

                <div>
                  <p><strong>Tipo de envío</strong></p>
                  <select
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    value={TipoEnvio}
                    onChange={(e) => setTipoEnvio(e.target.value)}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="recoger">Recoger en la empresa</option>
                    <option value="enviar">Enviar a una dirección</option>
                  </select>
                </div>

              </div>

            <div>
            
            {TipoEnvio !== '' && TipoEnvio !== 'recoger' && Departamentos && Departamentos.length > 0 && (
              <>
                <label htmlFor="region" className="block text-gray-700 font-semibold mb-1">Tipos de locación</label>
                <motion.select
                  name="region"
                  id="region"
                  className="border border-gray-300 p-1 rounded-lg"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleTipoLocacionSelect(e)}
                  style={{ width: "95%", margin: "auto" }}
                  value={TipoLocacion}
                >
                  <option value="" disabled>Seleccione un tipo de locación</option>
                  <option value="SELECCIONAR" >Seleccione una locación</option>
                  <option value="CREAR" >Crear una locación</option>
                </motion.select>
              </>
            )}

            {TipoEnvio !== '' && TipoEnvio !== 'recoger' && Departamentos && Departamentos.length > 0 && TipoLocacion === 'SELECCIONAR' && (
              <>
                <label htmlFor="region" className="block text-gray-700 font-semibold mb-1">Locaciones</label>
                <motion.select
                  name="region"
                  id="region"
                  className="border border-gray-300 p-1 rounded-lg"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleLocationSelectUnica(e)}
                  style={{ width: "95%", margin: "auto" }}
                  value={DatoLocacionCliente?.locacion || ""}
                >
                  <option value="" disabled>Seleccione una locación</option>
                  {DatosLocacionesCliente.map((locacion: Locacion) => (
                    <option 
                      key={`${locacion.coordenadas.latitud}-${locacion.coordenadas.longitud}`} 
                      value={locacion.locacion}
                    >
                      {`${locacion.departamento} - ${locacion.ciudad}: ${locacion.locacion}`}
                    </option>
                  ))}
                </motion.select>
              </>
            )}

            {TipoEnvio !== '' && TipoEnvio !== 'recoger' && Departamentos && Departamentos.length > 0 && (TipoLocacion && TipoLocacion == 'CREAR') &&  (
              <>
                <label htmlFor="region" className="block text-gray-700 font-semibold mb-1">Región</label>
                <motion.select
                  name="region"
                  id="region"
                  className="border border-gray-300 p-1 rounded-lg"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={handleRegionSelect}
                  style={{ width: "95%", margin: "auto" }}
                  value={RegionSeleccionadaNombre}
                >
                  <option value="" disabled>Seleccione una región</option>
                  {Departamentos.map(region => (
                    <option key={region.nombreRegion} value={region.nombreRegion}>
                      {region.nombreRegion}
                    </option>
                  ))}
                </motion.select>

                {RegionSeleccionadaNombre && (
                  <>
                    <label htmlFor="departamento" className="block text-gray-700 font-semibold mb-1">Departamentos</label>
                    <motion.select
                      name="departamento"
                      id="departamento"
                      className="border border-gray-300 p-1 rounded-lg"
                      onFocus={() => setIsSelecting(true)}
                      onBlur={() => setIsSelecting(false)}
                      onChange={handleDepartamentoSelect}
                      style={{ width: "95%", margin: "auto" }}
                      value={DepartamentoSeleccionado.identificador}
                    >
                      <option value="" disabled>Seleccione un departamento</option>
                      {Departamentos.filter(region => region.nombreRegion === RegionSeleccionadaNombre)
                        .flatMap(region =>
                          region.departamentos.map(departamento => (
                            <option key={departamento.codigoDANEDepartamento} value={departamento.codigoDANEDepartamento}>
                              {departamento.nombreDepartamento}
                            </option>
                          ))
                        )}
                    </motion.select>
                  </>
                )}

                {DepartamentoSeleccionado.nombre && (
                  <>
                    <label htmlFor="municipio" className="block text-gray-700 font-semibold mb-1">Municipios</label>
                    <motion.select
                      name="municipio"
                      id="municipio"
                      className="border border-gray-300 p-1 rounded-lg"
                      onFocus={() => setIsSelecting(true)}
                      onBlur={() => setIsSelecting(false)}
                      onChange={handleMunicipioSelect}
                      style={{ width: "95%", margin: "auto" }}
                      value={MunicipioSeleccionado.identificador}
                    >
                      <option value="" disabled>Seleccione un municipio</option>
                      {Departamentos.filter(region => region.nombreRegion === RegionSeleccionadaNombre)
                        .flatMap(region =>
                          region.departamentos
                            .filter(departamento => departamento.nombreDepartamento === DepartamentoSeleccionado.nombre)
                            .flatMap(departamento =>
                              departamento.municipios.map(municipio => (
                                <option key={municipio} value={municipio}>
                                  {municipio}
                                </option>
                              ))
                            )
                        )}
                    </motion.select>
                  </>
                )}
              </>
            )}
            </div>

            <div style={{marginTop:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
              {TipoEnvio !== '' && TipoEnvio !== 'recoger' &&
                <>
                  <button onClick={limpiarDato} className="px-4 py-2 rounded botonLimpiarDireccionEnvio">
                    <Eraser />
                  </button>
                  {MunicipioSeleccionado.nombre !== '' && TipoLocacion === 'CREAR' &&
                    <button onClick={abrirFormularioDireccion} className="px-4 py-2 rounded botonCompletarDireccionEnvio">
                      { 
                        typeof direccionGuardada === 'object' && direccionGuardada !== null 
                        ? 'Editar dirección' 
                        : 'Completar dirección'
                      }
                    </button>
                  }
                </>
              }
              {
                (
                  (
                    (typeof direccionGuardada === 'object' || TipoLocacion === 'SELECCIONAR') 
                    && TipoEnvio == 'enviar'
                  ) 
                  || 
                  (TipoEnvio == 'recoger')
                )
                 && 
                 ( Fecha && Fecha?.getDay() >= 0 && Fecha?.getHours() > 0 ) && (
                <button onClick={handleSubmit} className="text-white px-4 py-2 rounded botonEnviarDatosEnvio">
                  Enviar datos de envío
                </button>
              )}
            </div>

            </div>
            { TipoEnvio !== '' && TipoEnvio !== 'recoger' && (typeof direccionGuardada === 'object' || (typeof direccionGuardada === 'string' && TipoLocacion === 'SELECCIONAR'))  && selected && (
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg" style={{marginLeft:'40px'}}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={15}
                  center={selected || { lat: 4.624335, lng: -74.063644 }}
                  onClick={(e) => handleLocationSelect({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })}
                >
                  {selected && <Marker position={selected} />}
                </GoogleMap>
                <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ textAlign: 'center', margin: '0 auto' }}>
                    <strong>Coordenadas aprox</strong><br /> 
                    Latitud {selected.lat}, Longitud {selected.lng}
                  </p>
                  <p><strong>Dirección:</strong> 
                    {typeof direccionGuardada === 'object' ? ` ${direccionGuardada.tipoVia} ${direccionGuardada.numeroVia} ${direccionGuardada.prefijoVia} ${direccionGuardada.cardinalidadVia} # ${direccionGuardada.numeroViaCrl} ${direccionGuardada.prefijoViaCrl} ${direccionGuardada.cardinalidadViaCrl} - ${direccionGuardada.numeroPlaca}` : typeof direccionGuardada === 'string' ? ' '+direccionGuardada : "Sin dirección guardada"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <Modal
          isOpen={modalFormularioDireccion}
          onRequestClose={cerrarFormularioDireccion}
          contentLabel="Formulario de dirección"
          className="ModalOtra"
        >
          {modalFormularioDireccion && (
            <FormularioDireccion
              onSubmit={handleAddressSubmit}
              onCancel={cerrarFormularioDireccion}
              initialData={direccionGuardada}
              TituloFormulario={'Indique la dirección de envío'}
            />
          )}
        </Modal>
      </>
    );
  };
  

export default Envio;
