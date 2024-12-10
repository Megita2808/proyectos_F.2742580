/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import RegistrarCliente from '@/service/api/usuarios/usuario/RegistrarseCliente';
import Link from 'next/link';
import styles from '@/styles/styleLogin.module.css';
import Swal from 'sweetalert2';
import Notification from '../layaout/Notificaciones/usuarioLogin/Success';
import ReCAPTCHA from 'react-google-recaptcha';
import Modal from "react-modal";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "react-datepicker/dist/react-datepicker.css";
import { AlignCenter, Eraser, Lock, LockKeyhole, Mail, MapPinCheck, MapPinPlusInside, Phone, Undo2, User } from "lucide-react";

import { enviarTokenRecaptcha } from '@/service/api/usuarios/reCAPTCHA/reCAPTCHA'
import FormularioDireccion from "@/components/cliente/envio/microFormularioDireccion";
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';
import { motion } from "framer-motion";
import TerminosYCondicionesModal from "../layaout/elementos/terminosCondiciones";

interface MunicipioPorDepartamento {
  codigoDANEDepartamento: string;
  nombreDepartamento: string;
  municipios: string[];
}

interface RegionAgrupada {
  nombreRegion: string;
  departamentos: MunicipioPorDepartamento[];
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
Modal.setAppElement('#root');
const libraries: ("places")[] = ["places"];

const RegistroCliente: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(true);
  const [resultadoTerminosCondiciones, setResultadoTerminosCondiciones] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRegister, setIsRegister] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const [errorTelefono, setErrorTelefono] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);

  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [respuestaRecapcha, setResultadoRecaptcha] = useState<any | null>(null);
  const [direccionGuardada, setDireccionGuardada] = useState<any | null>(null);
  
  const [modalFormularioDireccion, setModalFormularioDireccion] = useState<boolean>(false);
  const [editando, setEditando] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [TipoDireccion, setTipoDireccion] = useState<string>('');
  const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(null);
  const puntoPartidaRef = useRef<google.maps.LatLngLiteral | null>(null);
  const limiteDistancia = 70;

  const [Departamentos, setDepartamentos] = useState<RegionAgrupada[]>([]);
  const [RegionSeleccionadaNombre, setRegionSeleccionadaNombre] = useState<string>('');
  const [DepartamentoSeleccionado, setDepartamentoSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  const [MunicipioSeleccionado, setMunicipioSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCM0IAKKlIGcBq0T9dU4UphG49CP_napAI",
    libraries,
  });

  const handlePasswordToggle = (id: string) => {
    const passwordInput = document.getElementById(id) as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (respuestaRecapcha !== 200) {
      setError('Por favor, completa el reCAPTCHA.');
      return;
    }
    if (!resultadoTerminosCondiciones) {
      setError('Para registrarse es necesario aceptar los terminos y condiciones.');
      return;
    }
    
    if (password !== password2 && selected === null) {
      setNotification({ type: 'error', message: 'Las contraseñas no coinciden.' });
    }else {
      try {

          const response = await RegistrarCliente(nombre, correo, telefono, direccion, DepartamentoSeleccionado.nombre, MunicipioSeleccionado.nombre, selected , password, router); 
          if (response) {
            Swal.fire({
              title: '¡Exitoso!',
              text: 'Registro de usuario exitoso!',
              icon: 'success',
              timerProgressBar: true,
              timer: 1500,
              showConfirmButton: false,
            });
            setSuccessMessage(response.mensaje);
          } else {
            setNotification({ type: 'error', message: 'La contraseña que ingresaste es incorrecta. Por favor, intenta de nuevo.' });
          }

      } catch (error) {
        setNotification({ type: 'error', message: 'Hubo un error al confirmar la contraseña.' });
      }
    }
  };

  const handleInputCorreo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const correo = e.target.value.replace(/\s+/g, ' ').trim();
  
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (regexCorreo.test(correo) && correo.length >= 6 && correo.length <= 50) {
      setCorreo(correo);
      setErrorCorreo(false);
      console.log(correo);
    } else {
      setCorreo('');
      setErrorCorreo(true);
    }
  };

  const handleInputTelefono = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let telefono = e.target.value;
    
    const regexTelefono = /^(\d{3}\s?)+$/;
  
    telefono = telefono.replace(/\s+/g, ' ').trim(); 
  
    if (regexTelefono.test(telefono) || telefono.length <= 3) {
      setTelefono(telefono);
    } else {
      setTelefono(telefono.replace(/\s/g, ''));
    }

    if (telefono.length > 9 && telefono.length < 13) {
      setErrorTelefono(false);
    } else {
      setErrorTelefono(true);
    }
  };

  const handleRecaptchaChange = async (token: string | null) => {
    if (token) {
      try {
        const verificationResult = await enviarTokenRecaptcha(token);
        setResultadoRecaptcha(verificationResult);
        setRecaptchaToken(token);
      } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
      }
    } else {
      console.log('Token de reCAPTCHA es nulo');
    }
  };
  
  const obtenerDepartamentosRegiones = useCallback(async () => {
    obtenerDepartamentos().then((datosDepartamento) => {
      if (datosDepartamento) {
          setDepartamentos(datosDepartamento);
      }
    });
  }, []);

  const abrirFormularioDireccion = async () => {
    setModalFormularioDireccion(true);
  };

  const cerrarFormularioDireccion = () => {
    setModalFormularioDireccion(false);
    setEditando(false);
  };

  const handleAddressSubmit = (data: any, tipoDireccion: string) => {
    const direccionCompleta = `${data.tipoVia} ${data.numeroVia} ${data.prefijoVia} ${data.cardinalidadVia} # ${data.numeroViaCrl} ${data.prefijoViaCrl} ${data.cardinalidadViaCrl} - ${data.numeroPlaca}`;
    setTipoDireccion(tipoDireccion);
    setDireccionGuardada(data);
    setDireccion(direccionCompleta)
    obtenerCoordenadasPorDireccion(direccionCompleta);
    setEditando(false);
  };

  const obtenerCoordenadasPorDireccion = async (direccionDatos: string) => {
    const apiKey = "AIzaSyCM0IAKKlIGcBq0T9dU4UphG49CP_napAI";
    const direccionFormateada = obtenerDireccionFormateada(direccionDatos);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionFormateada)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const latLng = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
        setSelected(latLng);
      } else {
        console.error("No se encontraron resultados para la dirección proporcionada.");
      }
    } catch (error) {
      console.error("Error obteniendo las coordenadas:", error);
    }
  };

  const obtenerDireccionFormateada = (direccion: any) => {
    let direccionCompleta = `${direccion.tipoVia} ${direccion.numeroVia} ${direccion.prefijoVia} ${direccion.cardinalidadVia} # ${direccion.numeroViaCrl} ${direccion.prefijoViaCrl} ${direccion.cardinalidadViaCrl} - ${direccion.numeroPlaca}`;
    direccionCompleta = direccionCompleta.replace(/\s+/g, ' ').trim();
    const municipio = MunicipioSeleccionado.nombre;
    const departamento = DepartamentoSeleccionado.nombre;
    return `${departamento}, ${municipio}, ${direccionCompleta}`;
  };
  
  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedNombre = e.target.value;
    setRegionSeleccionadaNombre(selectedNombre);
    setDepartamentoSeleccionado({ identificador:'', nombre: '' });
    setMunicipioSeleccionado({ identificador:'', nombre: '' });
  };

  const handleDepartamentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIdentificador = e.target.value;
    const selectedDepartamentoNombre = e.target.options[e.target.selectedIndex].text;
    setDepartamentoSeleccionado({
      identificador: selectedIdentificador, 
      nombre: selectedDepartamentoNombre
    });
    setMunicipioSeleccionado({ identificador: '', nombre: '' });
  };

  const handleMunicipioSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedIdentificador = e.target.value;
    const selectedMunicipioNombre = e.target.options[e.target.selectedIndex].text;
    setMunicipioSeleccionado({ identificador: selectedIdentificador, nombre: selectedMunicipioNombre });
  };

  const handleResultado = (resultado: boolean) => {
    setModalOpen(false);
    if (resultado) {    
      setResultadoTerminosCondiciones(resultado);
      console.log("Términos aceptados.");
    } else {
      setResultadoTerminosCondiciones(false);
      console.log("Términos no aceptados.");
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    obtenerDepartamentosRegiones();
  }, [obtenerDepartamentosRegiones]);

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

        <div className={`${"container_form"} ${isRegister && !isLogin ? "register" : "hide"}`}  style={{height:'600px'}}>
          <div className="information">
            <div className="info_childs" style={{
              border: 'solid grey',
              borderRadius: '20px',
              borderWidth:'1px',
              width: '90%',
              height:'80%',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              margin: '0 auto',
              gap:'5px'
            }}>
              <p className="robotoFont">Volver a la página principal</p>
              <Link href="/" legacyBehavior>
                <a>
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="img" 
                    width={90} 
                    height={90} 
                    style={{
                      border: 'solid black', 
                      borderRadius: '50px', 
                      borderWidth: '1px', 
                      boxShadow: '1px 0px 2px'
                    }} 
                  />
                </a>
              </Link>
              <h2 className="h2">Bienvenido</h2>
              <p className="p">Para ingresar en Halplast, por favor inicia sesión con tus datos</p>
              <Link href={"/cliente/login/cliente"}>
                <input className="botones" type="button" value="Iniciar Sesión" id="sign-in" />
              </Link>
            </div>
          </div>

          <div className="form_information">
            <div className="form_information_childs" style={{marginTop:'10px', marginBottom:'-10px'}}>
              <h2 className="robotoFont" style={{marginBottom:'-20px'}}>Crear una Cuenta</h2>
              <form className="form" id="form1" onSubmit={handleFormSubmit}>
                <label>
                  <User style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                  <input type="text" id="nombre" placeholder="Nombre Completo" onChange={(e) => setNombre(e.target.value)} required autoComplete="nombre" />
                </label>
                <label>
                  <Mail style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                  <input type="email" id="email" placeholder="Correo Electrónico" onChange={handleInputCorreo} required autoComplete="correo" />
                </label>
                  {errorCorreo && (
                    <p style={{color: 'red', fontSize: '10px', margin:'0px',marginBottom:'10px',marginTop:'-10px'}}>El correo no es válido o está fuera de rango (6 a 50 caracteres).</p>
                  )}
                <label>
                  <Phone style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                  <input type="text" id="telefono" placeholder="Telefono" onChange={handleInputTelefono} value={telefono} required autoComplete="correo" />
                </label>
                  {errorTelefono && (
                    <p style={{color: 'red', fontSize: '10px', margin:'0px',marginBottom:'10px',marginTop:'-10px'}}>El teléfono debe tener entre 10 y 12 caracteres.</p>
                  )}
                <label>
                  {direccion !== '' 
                    ? <MapPinCheck style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                    : <MapPinPlusInside style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                  }
                  
                  <input 
                    type="text" 
                    id="direccionResumen" 
                    placeholder="Dirección resumen" 
                    onClick={abrirFormularioDireccion} 
                    value={direccionGuardada? obtenerDireccionFormateada(direccionGuardada) : ''}
                    onChange={() => {}}
                    required 
                    readOnly={direccion !== ''} 
                    style={{ cursor: direccion !== '' ? 'pointer' : 'text' }}
                  />

                </label>
                <label>
                  <Lock style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                  <input type="password" id="password3-1" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password1" />
                  <i className="bx bx-show" onClick={() => handlePasswordToggle("password3-1")}></i>
                </label>
                <label>
                  <LockKeyhole style={{color: 'grey', fontSize: '20px', padding: '0px'}} />
                  <input type="password" id="password3-2" placeholder="Confirmar Contraseña" onChange={(e) => setPassword2(e.target.value)} required autoComplete="new-password2"/>
                  <i className="bx bx-show" onClick={() => handlePasswordToggle("password3-2")}></i>
                </label>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '0 auto',
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      marginTop: '5px',
                      width: '20px',
                      height: '20px',
                    }}
                    checked={resultadoTerminosCondiciones}
                    onChange={(e) => handleResultado(e.target.checked)}
                  />
                  <button
                    style={{
                      marginBottom: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setModalOpen(true)}
                  >
                    Mostrar Términos y Condiciones
                  </button>
                </div>
                <ReCAPTCHA
                  sitekey="6LfYLFAqAAAAACrq-OtocTSCgahpHGcY0pcOKL_p"
                  onChange={handleRecaptchaChange}
                />

                <button className="botones" type="submit" style={{marginTop:'10px'}}>Registrar</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
              </form>
            </div>
          </div>
        </div>

      <TerminosYCondicionesModal isOpen={modalOpen} onSelect={handleResultado} />

      <Modal
        isOpen={modalFormularioDireccion}
        onRequestClose={cerrarFormularioDireccion}
        contentLabel="Formulario de dirección"
        className="ModalContentRegistro"
        ariaHideApp={false} 
      >
        <div className="ModalContentRegistro" style={{backgroundColor:'transparent'}}>
          <div className="ModalContentSinImagen" style={{textAlign: 'center', minWidth:'300px'}}>
            <label className="titleSinFondoModal" style={{marginTop: '20px'}}>Agregar zona del país</label>
            
            {Departamentos && Departamentos.length > 0 && (
              <>
                <label 
                  htmlFor="region" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '15px',
                    marginTop: '10px',
                  }}>
                  Región
                </label>

                <motion.select
                  name="region"
                  id="region"
                  className="address-form__select"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleRegionSelect(e)}
                  style={{ 
                    width: "80%", 
                    margin: "0 auto 20px auto",
                    display: "block",
                  }}
                  value={RegionSeleccionadaNombre}
                >
                  <option value="" disabled>Seleccione una región</option>
                  {Departamentos.map((Region) => (
                    <option key={Region.nombreRegion} value={Region.nombreRegion}>
                      {Region.nombreRegion}
                    </option>
                  ))}
                </motion.select>
              </>
            )}

            {RegionSeleccionadaNombre && RegionSeleccionadaNombre !== '' && (
              <>
                <label 
                  htmlFor="departamento" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '15px', 
                    marginTop: '10px', 
                  }}
                >
                  Departamentos
                </label>
                
                <motion.select
                  name="departamento"
                  id="departamento"
                  className="address-form__select"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleDepartamentoSelect(e)}
                  style={{ 
                    width: "80%", 
                    margin: "0 auto 20px auto", 
                    display: "block",
                  }}
                  value={DepartamentoSeleccionado.identificador}
                >
                  <option value="" disabled>Seleccione un departamento</option>
                  {Departamentos.filter((region) => region.nombreRegion === RegionSeleccionadaNombre)
                    .flatMap((Region) =>
                      Region.departamentos.map((Departamento) => (
                        <option key={Departamento.codigoDANEDepartamento} value={Departamento.codigoDANEDepartamento}>
                          {Departamento.nombreDepartamento}
                        </option>
                      ))
                    )}
                </motion.select>
              </>
            )}

            {DepartamentoSeleccionado && DepartamentoSeleccionado.nombre !== '' && (
              <>
                <label 
                  htmlFor="municipio" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '15px', 
                    marginTop: '10px', 
                  }}
                >
                  Municipios
                </label>

                <motion.select
                  name="municipio"
                  id="municipio"
                  className="address-form__select"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleMunicipioSelect(e)}
                  style={{ 
                    width: "80%", 
                    margin: "0 auto 20px auto", 
                    display: "block",
                  }}
                  value={MunicipioSeleccionado.identificador}
                >
                  <option value="" disabled>Seleccione un municipio</option>
                  {Departamentos.filter((Region) => Region.nombreRegion === RegionSeleccionadaNombre)
                    .flatMap((Region) =>
                      Region.departamentos
                        .filter((departamento) => departamento.nombreDepartamento === DepartamentoSeleccionado.nombre)
                        .flatMap((departamento) =>
                          departamento.municipios.map((municipio) => (
                            <option key={municipio} value={municipio}>
                              {municipio}
                            </option>
                          ))
                        )
                    )}
                </motion.select>
                <div className="address-form__summary">
                  <h4><strong>Resumen zona del pais</strong></h4>
                  <input type="text" className="address-form__disabled" style={{width:'100%', marginTop:'5px'}} disabled value={ Departamentos.length > 0 ? DepartamentoSeleccionado.nombre + ' - ' + MunicipioSeleccionado.nombre : ''}/>
                </div>
              </>
            )}
          </div>

          {modalFormularioDireccion && MunicipioSeleccionado.nombre !== '' && (
            <FormularioDireccion
              onSubmit={handleAddressSubmit}
              onCancel={cerrarFormularioDireccion}
              initialData={direccionGuardada}
              TituloFormulario={'Indique su direccion de entrega'}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RegistroCliente;
