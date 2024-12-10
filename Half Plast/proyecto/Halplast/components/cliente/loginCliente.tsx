/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import confirmPassword from '@/service/api/usuarios/usuario/LogearseCliente';
import Link from 'next/link';
import axios2 from '@/utils/axiosConfig';
import Swal from 'sweetalert2';
import Notification from '../layaout/Notificaciones/usuarioLogin/Success';
import ReCAPTCHA from 'react-google-recaptcha';

import { enviarTokenRecaptcha } from '@/service/api/usuarios/reCAPTCHA/reCAPTCHA'
import SolicitudRecuperarContraseña from '@/service/api/usuarios/usuario/SolicitarRecuperarPassword';

import CryptoJS from 'crypto-js';

const decrypt = (encryptedData: string, iv: string, encryptionKey: string): string => {
  try {

      const key = CryptoJS.enc.Hex.parse(encryptionKey);
      const ivParsed = CryptoJS.enc.Hex.parse(iv);
      const ciphertext = CryptoJS.enc.Hex.parse(encryptedData);

      const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
          iv: ivParsed,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
      });

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      console.log('Resultado desencriptado:', result);

      return result;
  } catch (error) {
      console.error('Error al desencriptar:', error);
      return '';
  }
};

const ComponenteLoginCliente: React.FC = () => {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [isRegister, setIsRegister] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [codigoAcceso, setCodigoAcceso] = useState<string>('');
  const [datosUsuario, setDatosUsuario] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [respuestaRecapcha, setResultadoRecaptcha] = useState<any | null>(null);
  const [EnvioSolicitud, setEnvioSolicitud] = useState<boolean>(false);
  
  const toggleForm = () => {
    setIsRegister(false);
    setIsChangePassword(false);
    setIsLogin(true);
  };

  const toggleChangePassword = () => {
    setIsChangePassword(true);
    setIsRegister(false);
    setIsLogin(false);
  };

  const handleSignUp = () => {
    setIsRegister(true);
    setIsChangePassword(false);
    setIsLogin(false);
  };

  const handlePasswordToggle = (id: string) => {
    const passwordInput = document.getElementById(id) as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  };

  const handleSubmit =  useCallback (async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!recaptchaToken || respuestaRecapcha !== 200) {
      setError('Por favor, completa el reCAPTCHA.');
      return;
    }

    try {
      const response = await confirmPassword(correo, password, dispatch, router); 
      if (response && response.status === 200) {
        router.push('/cliente/principal');
        setTimeout(() => {
          Swal.fire({
            title: '¡Exitoso!',
            text: 'Inicio de sesión exitoso!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
        }, 1000);        
      }else if (response && response.status === 201){
        setNotification({ type: 'error', message: 'El usuario está inhabilitado. Por favor, contacte al soporte.' 
        });
      }else if (response && response.status === 202){
        setNotification({ type: 'error', message: 'El usuario está inhabilitado. Por favor, contacte al soporte.' 
        });
      } else {
        setNotification({ type: 'error', message: 'Usuario no existe' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Hubo un error al confirmar la contraseña.' });
    }
  },[correo, dispatch, password, respuestaRecapcha, router]);
  
  const handleRecaptchaChange = async (token: string | null) => {
    if (token) {
      try {
        const verificationResult = await enviarTokenRecaptcha(token);
        if (verificationResult && verificationResult === 200) {
          setResultadoRecaptcha(200);
          setRecaptchaToken(token);
        } else {
          setResultadoRecaptcha(null);
        }
      } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
      }
    } else {
      console.log('Token de reCAPTCHA es nulo');
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (isRegister) {
        await axios2.post('/register', {});
        setSuccessMessage('Registro exitoso');
      } else if (isChangePassword) {
        await axios2.post('/change-password', {});
        setSuccessMessage('Cambio de contraseña exitoso');
      }
    } catch (error) {
      setError('Hubo un error al procesar la solicitud.');
    }
  };

  const handleFormSubmitCambiarContraseña = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (correo && codigoAcceso) {
        if (codigoAcceso !== datosUsuario){  
        setError('El codigo de acceso no coincide.');
        }
        await axios2.post('api/usuarios/restablecerPassword', {
          correo: correo,
          codigoAcceso: codigoAcceso,
          nuevaPassword: password,
        });
        Swal.fire({
          title: '¡Exitoso!',
          text: 'Cambio de contraseña exitoso!',
          icon: 'success',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });

        toggleForm();
      }
    } catch (error) {
      setError('Hubo un error al procesar la solicitud.');
    }
  };

  const handleSolicitudCambioContraseña = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        if (correo) {
            const response = await SolicitudRecuperarContraseña(correo);

            if (response && response.status === 200 && response.data?.encryptedCode) {
                const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';
                if (!encryptionKey || encryptionKey.length !== 64) {
                    throw new Error('La clave de desencriptación no está configurada correctamente.');
                }

                const datosUsuario = decrypt(response.data.encryptedCode, response.data.iv, encryptionKey);
                setDatosUsuario(datosUsuario)
                setEnvioSolicitud(true)
            }
        }
    } catch (error) {
        console.error(error);
        setError('Hubo un error al procesar la solicitud.');
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div id="contenidoLoginCompleto">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        <div className={`${"container_form"} ${isRegister ? "register" : "hide"}`}>
          <div className="information">
            <div className="info_childs">
              <h2 className="h2">Bienvenido</h2>
              <p className="p">Para ingresar en Halplast, por favor inicia sesión con tus datos</p>
              <input className="botones" type="button" value="Iniciar Sesión" id="sign-in" onClick={toggleForm} />
            </div>
          </div>
          <div className="form_information">
            <div className="form_information_childs">
              <h2 className="robotoFont">Crear una Cuenta</h2>
              <div className="icons">
                <Link href="/" legacyBehavior>
                  <a>
                    <img src="/logo.png" alt="Logo" className="img" width={70} height={70} />
                  </a>
                </Link>
                <p className="robotoFont">Volver a la página principal</p>
              </div>
              <form className="form" id="form1" onSubmit={handleFormSubmit}>
                <label>
                  <i className="bx bx-user"></i>
                  <input type="text" id="nombre" placeholder="Nombre Completo" required />
                </label>
                <label>
                  <i className="bx bx-envelope"></i>
                  <input type="email" id="email" placeholder="Correo Electrónico" required autoComplete="username" />
                </label>
                <label>
                  <i className="bx bx-lock-alt"></i>
                  <input type="password" id="password3-1" placeholder="Contraseña" required autoComplete="new-password" />
                  <i className="bx bx-show" onClick={() => handlePasswordToggle("password3-1")}></i>
                </label>
                <label>
                  <i className="bx bx-lock-alt"></i>
                  <input type="password" id="password3" placeholder="Confirmar Contraseña" required autoComplete="new-password"/>
                  <i className="bx bx-show" onClick={() => handlePasswordToggle("password3")}></i>
                </label>

                <button className="botones" type="submit">Registrar</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
              </form>
            </div>
          </div>
        </div>

        <div id='longiDivCompleto' className={`${"container_form"} ${isLogin ? "Login" : "hide"}`}>
          <div className="information">
            <div className="info_childs">
              <h2 className="h2" id='BienvenidoLogin'>¡¡Bienvenido nuevamente!!</h2>
              <p className="p">Para ingresar en Halplast, por favor inicia sesión con tus datos</p>
              <input className="botones" type="button" value="Registrarse" onClick={handleSignUp} /><br /><br />
              <input className="botones" type="button" value="Cambiar Contraseña" onClick={toggleChangePassword} />
            </div>
          </div>
          <div className="form_information">
            <div className="form_information_childs">
              <h2>Iniciar Sesión</h2>
              <div className="icons">
                <Link href="/" legacyBehavior>
                  <a>
                    <img src="/logo.png" alt="Logo" id='imagenLoginIniciarSesion' className="img" width={120} height={120} />
                  </a>
                </Link>
                <p className="p" id='volverPaginaPrincipalLog'>Volver a la página principal</p>
              </div>
              <form className="form" id="form2" onSubmit={handleSubmit}>
                <label>
                  <i className="bx bx-envelope"></i>
                  <input
                    type="email"
                    id="correo-test"
                    placeholder="Correo Completo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </label>
                <label>
                  <i className="bx bx-lock-alt"></i>
                  <input type="password" id="password2-1" onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required autoComplete="new-password1" value={password} />
                  <i className="bx bx-show" onClick={() => handlePasswordToggle("password2-1")}></i>
                </label>

                <ReCAPTCHA
                  sitekey="6LfYLFAqAAAAACrq-OtocTSCgahpHGcY0pcOKL_p"
                  id="recaptchaLogin"
                  onChange={handleRecaptchaChange}
                  onExpired={() => {
                    console.log('reCAPTCHA expirado');
                    setResultadoRecaptcha(null);
                    setRecaptchaToken('');
                  }}
                />

                <button className="botones" id='submitIniciarSesion' type="submit" disabled={respuestaRecapcha !== 200}>Iniciar Sesión</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
              </form>
            </div>
          </div>
        </div>

        <div className={`${"container_form"} ${isChangePassword ? "cambiar" : "hide"}`}>
          <div className="information">
            <div className="info_childs">
              <h2 className="h2">¡¡Bienvenido nuevamente!!</h2>
              <p className="p">Para cambiar tu contraseña, por favor digita el código que llegó a tu correo</p>
              <input className="botones" type="button" value="Iniciar Sesión" onClick={toggleForm} />
            </div>
          </div>
          <div className="form_information">
            <div className="form_information_childs">
              <h2>Cambio de contraseña</h2>
              <div className="icons">
                <Link href="/" legacyBehavior>
                  <a>
                    <img src="/logo.png" alt="Logo" id='imagenCambioContraseña' className="img" width={120} height={120} />
                  </a>
                </Link>
                <p className="p" id='volverPaginaPrincipalCambioContraseña'>Volver a la página principal</p>
              </div>
              { !EnvioSolicitud &&
                <>
                  <form className="form" id="form3" onSubmit={handleSolicitudCambioContraseña}>
                    <label>
                      <i className="bx bx-lock-alt"></i>
                      <input type="text" id="Correo" placeholder="Correo" onChange={(e)=>setCorreo(e.target.value)} value={correo || ''} required autoComplete="codeHalplast"/>
                    </label>
                    <button className="botones" type="submit">Enviar Solicitud</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                  </form>
                </>
              }

              { EnvioSolicitud &&
                <>
                  <form className="form" id="form3" onSubmit={handleFormSubmitCambiarContraseña}>
                    <label>
                      <i className="bx bx-lock-alt"></i>
                      <input type="text" id="codigo" placeholder="Código" value={codigoAcceso || ''} onChange={(e)=>setCodigoAcceso(e.target.value)} required autoComplete="codeHalplast"/>
                    </label>
                    <label>
                      <i className="bx bx-lock-alt"></i>
                      <input type="password" id="password2" onChange={(e) => setPassword(e.target.value)} placeholder="Nueva Contraseña" required autoComplete="new-password1" value={password} />
                      <i className="bx bx-show" onClick={() => handlePasswordToggle("password2")}></i>
                    </label>
                    <button className="botones" type="submit">Confirmar Contraseña</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                  </form>
                </>
              }
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ComponenteLoginCliente;
