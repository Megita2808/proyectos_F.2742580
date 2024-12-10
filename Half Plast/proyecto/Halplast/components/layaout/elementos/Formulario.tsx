"use client";
import React, { useEffect, useState } from 'react';
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';
import { motion } from 'framer-motion';
import AgregarDistribuidor from '@/service/api/usuarios/distribuidor/EnviarSolicitud';
import Swal from 'sweetalert2';

interface MunicipioPorDepartamento {
    codigoDANEDepartamento: string;
    nombreDepartamento: string;
    municipios: string[];
}

interface RegionAgrupada {
    nombreRegion: string;
    departamentos: MunicipioPorDepartamento[];
}

interface FormData {
    nombreEmpresa: string;
    ubicacion: string;
    telefono: string;
    emailEmpresa: string;
}

interface FormErrors {
    nombreEmpresa?: string;
    ubicacion?: string;
    telefono?: string;
    emailEmpresa?: string;
}

const ContactForm: React.FC = () => { 
    const [isSelecting, setIsSelecting] = useState(false);
    const [RegionSeleccionadaNombre, setRegionSeleccionadaNombre] = useState<string>('');
    const [Departamentos, setDepartamentos] = useState<RegionAgrupada[]>([]);
    const [DepartamentoSeleccionado, setDepartamentoSeleccionado] = useState<{identificador: string; nombre: string}>({identificador:'', nombre: ''});
    const [MunicipioSeleccionado, setMunicipioSeleccionado] = useState<{identificador: string; nombre: string}>({identificador:'', nombre: ''});
    const [ConfirmacioCorreo, setConfirmacioCorreo] = useState<string>('');
    const [FormularioSubidoTiempo, setFormularioSubidoTiempo] = useState(false);
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        nombreEmpresa: '',
        ubicacion: '',
        telefono: '',
        emailEmpresa: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleConfirmarCorreo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmacioCorreo(e.target.value)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = (): FormErrors => {
        let formErrors: FormErrors = {};
    
        if (!formData.nombreEmpresa) {
            formErrors.nombreEmpresa = 'El nombre de la empresa es obligatorio';
        } else if (formData.nombreEmpresa.length < 3) {
            formErrors.nombreEmpresa = 'El nombre de la empresa debe tener al menos 3 caracteres';
        }
    
        if (!formData.ubicacion) {
            formErrors.ubicacion = 'La ubicación de la empresa es obligatoria';
        } else if (formData.ubicacion.length < 6) {
            formErrors.ubicacion = 'La ubicación debe tener al menos 6 caracteres';
        }
    
        if (!formData.telefono) {
            formErrors.telefono = 'El teléfono de la empresa es obligatorio';
        } else if (formData.telefono.length < 10) {
            formErrors.telefono = 'El teléfono debe tener al menos 10 caracteres';
        }
    
        if (!formData.emailEmpresa) {
            formErrors.emailEmpresa = 'El correo electrónico de la empresa es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.emailEmpresa)) {
            formErrors.emailEmpresa = 'El correo electrónico no es válido';
        }
    
        if (ConfirmacioCorreo != '' && formData.emailEmpresa!== ConfirmacioCorreo) {
            formErrors.emailEmpresa = 'Los correos electrónicos no coinciden';
        }
        return formErrors;
    };
    
    const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const selectedNombre = e.target.value;
        setRegionSeleccionadaNombre(selectedNombre);
        setDepartamentoSeleccionado({identificador:'', nombre: ''});
        setMunicipioSeleccionado({identificador:'', nombre: ''});
    };

    const handleDepartamentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIdentificador = e.target.value;
        const selectedDepartamentoNombre = e.target.options[e.target.selectedIndex].text;
        setDepartamentoSeleccionado({
            identificador: selectedIdentificador, 
            nombre: selectedDepartamentoNombre
        });
        setMunicipioSeleccionado({identificador: '', nombre: ''});
    };

    const handleMunicipioSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const selectedIdentificador = e.target.value;
        const selectedMunicipioNombre = e.target.options[e.target.selectedIndex].text;
        setMunicipioSeleccionado({identificador: selectedIdentificador, nombre: selectedMunicipioNombre});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors = validateForm();
    
        if (Object.keys(formErrors).length === 0 && formData) {
            if (FormularioSubidoTiempo) return;
    
            setFormularioSubidoTiempo(true); 
    
            const distribuidor = await AgregarDistribuidor(
                formData,
                DepartamentoSeleccionado,
                MunicipioSeleccionado,
            );
            if (distribuidor) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La solicitud ha sido enviada correctamente. Se notificará al correo ingresado sobre la respuesta de nuestra empresa.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                setTimeout(() => {
                    setFormularioSubidoTiempo(false);
                }, 30000);
            } else if (distribuidor === 400) {
                Swal.fire({
                    title: 'Error',
                    text: 'Este correo ya ha realizado una solicitud previamente. Por favor, utiliza un correo diferente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                setTimeout(() => {
                    setFormularioSubidoTiempo(false);
                }, 7000);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                setTimeout(() => {
                    setFormularioSubidoTiempo(false);
                }, 7000);
            }
        } else {
            setErrors(formErrors);
        }
    };

    const handleClear = () => {
        setFormData({
            nombreEmpresa: '',
            ubicacion: '',
            telefono: '',
            emailEmpresa: ''
        });
        setErrors({});
        setRegionSeleccionadaNombre('');
        setDepartamentoSeleccionado({ identificador: '', nombre: '' });
        setMunicipioSeleccionado({ identificador: '', nombre: '' });
        setConfirmacioCorreo('')
    };

    useEffect(() => {
        obtenerDepartamentos().then((datosDepartamento) => {
            if (datosDepartamento) {
                setDepartamentos(datosDepartamento);
            }
        });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px', background: 'linear-gradient(to top, #00acc1, #80deea, #4dd0e1, #00acc1, #e0f7fa)', width:'40%', margin:'0 auto', borderRadius:'10px'}}>
            <h1 style={{backgroundColor:'white', borderRadius:'10px', padding:'7px', fontSize:'17px', fontWeight:'bold' }}>Formulario para convertirse en distribuidor</h1>
            <form onSubmit={handleSubmit} style={{ width: '100%',marginLeft:'31px', marginTop: '20px', }}>
                <label>
                    <input
                        type="text"
                        name="nombreEmpresa"
                        placeholder="Nombre empresa o razón social"
                        value={formData.nombreEmpresa}
                        onChange={handleChange}
                        style={{ width: '95%', marginBottom: '5px', padding: '10px', borderRadius:'10px' }}
                        required
                    />
                    {errors.nombreEmpresa && <p style={{ color: 'red' }}>{errors.nombreEmpresa}</p>}
                </label>

                {Departamentos && Departamentos.length > 0 && (
                    <>
                        <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">Region</label>
                        <motion.select
                            name="IdentificarColorModal"
                            id="IdentificarColorModal"
                            className="border border-gray-300 p-1 rounded-lg"
                            onFocus={() => setIsSelecting(true)}
                            onBlur={() => setIsSelecting(false)}
                            onChange={(e) => handleRegionSelect(e)}
                            style={{ width: "95%", margin: "auto" }}
                            value={RegionSeleccionadaNombre}
                        >
                            <option value="" disabled>Seleccione una region</option>
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
                        <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">Departamentos</label>
                        <motion.select
                            name="IdentificarColorModal"
                            id="IdentificarColorModal"
                            className="border border-gray-300 p-1 rounded-lg"
                            onFocus={() => setIsSelecting(true)}
                            onBlur={() => setIsSelecting(false)}
                            onChange={(e) => handleDepartamentoSelect(e)}
                            style={{ width: "95%", margin: "auto" }}
                            value={DepartamentoSeleccionado.identificador}
                        >
                            <option value="" disabled>Seleccione un departamento</option>
                            {Departamentos.filter((region) => region.nombreRegion === RegionSeleccionadaNombre)
                                .map((Region) =>
                                    Region.departamentos.map((Departamento) => (
                                        <option
                                            key={Departamento.codigoDANEDepartamento}
                                            value={Departamento.codigoDANEDepartamento}
                                        >
                                            {Departamento.nombreDepartamento}
                                        </option>
                                    ))
                                )}
                        </motion.select>
                    </>
                )}

                {DepartamentoSeleccionado && DepartamentoSeleccionado.nombre !== '' && (
                    <>
                        <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">Municipios</label>
                        <motion.select
                            name="IdentificarColorModal"
                            id="IdentificarColorModal"
                            className="border border-gray-300 p-1 rounded-lg"
                            onFocus={() => setIsSelecting(true)}
                            onBlur={() => setIsSelecting(false)}
                            onChange={(e) => handleMunicipioSelect(e)}
                            style={{ width: "95%", margin: "auto" }}
                            value={
                                MunicipioSeleccionado.identificador
                            }
                        >
                            <option value="" disabled>Seleccione un municipio</option>
                            {Departamentos.filter((Region) => Region.nombreRegion === RegionSeleccionadaNombre)
                                .map((Region) =>
                                    Region.departamentos
                                    .filter((departamento) => departamento.nombreDepartamento === DepartamentoSeleccionado.nombre)
                                    .map((departamento) =>
                                        departamento.municipios.map((municipio) => (
                                            <option key={municipio} value={municipio}>
                                                {municipio}
                                            </option>
                                        ))
                                    )
                                )
                            }
                        </motion.select>
                    </>
                )}

                <label>
                    <input
                        type="text"
                        name="ubicacion"
                        placeholder="Ubicación de la empresa"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        style={{ width: '95%', marginBottom: '10px', padding: '10px' , marginTop: '15px', borderRadius:'10px'}}
                        required
                    />
                    {errors.ubicacion && <p style={{ color: 'red' }}>{errors.ubicacion}</p>}
                </label>

                <label>
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono de la empresa"
                        value={formData.telefono}
                        onChange={handleChange}
                        style={{ width: '95%', marginBottom: '10px', padding: '10px', borderRadius:'10px' }}
                        required
                    />
                    {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono}</p>}
                </label>

                <label>
                    <input
                        type="email"
                        name="emailEmpresa"
                        placeholder="Correo empresa"
                        value={formData.emailEmpresa}
                        onChange={handleChange}
                        style={{ width: '95%', marginBottom: '10px', padding: '10px', borderRadius:'10px' }}
                        required
                    />
                    {errors.emailEmpresa && <p style={{ color: 'red' }}>{errors.emailEmpresa}</p>}
                </label>

                <label>
                    <input
                        type="email"
                        name="emailEmpresa2"
                        placeholder="Confirmar correo"
                        value={ConfirmacioCorreo}
                        onChange={handleConfirmarCorreo}
                        style={{ width: '95%', marginBottom: '20px', padding: '10px', borderRadius:'10px' }}
                        required
                    />
                    {errors.emailEmpresa && <p style={{ color: 'red' }}>{errors.emailEmpresa}</p>}
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button
                    onMouseEnter={() => setHover1(true)}
                    onMouseLeave={() => setHover1(false)}
                    type="submit" style={{ width: '40%', padding: '10px', backgroundColor: hover1 ? '#0090f3' :  '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }} disabled={FormularioSubidoTiempo}>
                        {FormularioSubidoTiempo ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                    <button      
                        onMouseEnter={() => setHover2(true)}
                        onMouseLeave={() => setHover2(false)}
                        type="button" onClick={handleClear} style={{ width: '40%', padding: '10px', backgroundColor: hover2 ? 'rgb(255, 103, 90)' : 'rgb(255, 125, 107)', color: 'white', border: 'none', borderRadius: '5px', marginRight:'30px'}}>
                        Limpiar datos
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
