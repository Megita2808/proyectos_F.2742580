"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "@/components/common/Loader";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import Modal from "@/app/Modal/modal"; 
import { Popover, Typography } from "antd";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Checkbox, FormControlLabel } from "@mui/material";

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    names: "",
    lastnames: "",
    dni: "",
    mail: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
    loading: false,
    acceptedTerms: false,
    showPassword: false,
    showConfirmPassword: false,
    modalOpen: false,
    verificationData: null,
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        router.push("/");
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (password.length < 6) return "Muy débil";
    if (password.length < 10) return "Débil";
    if (/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) return "Fuerte";
    return "Moderada";
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, acceptedTerms: !prev.acceptedTerms }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const {
      names, lastnames, dni, mail, phone_number, password, confirmPassword, acceptedTerms
    } = formData;

    if (!acceptedTerms) {
      await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html: "Debes aceptar los términos y condiciones para registrarte.",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        
      });
      return;
    }

    if (password !== confirmPassword) {
        await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html: "Las contraseñas no coinciden",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation) {
      
      await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html: "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },

      });
      return;
    }

    const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/verificationcodes_generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail })
    });

    const responseJson = await response.json();

    if (!responseJson.ok) {
      await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html: "Hubo un problema al generar el código de verificación",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        modalOpen: true,
        // verificationData: { mail },
      }));
    }
  };

  const handleModalSubmit = async (code: string) => {
    setFormData((prev) => ({ ...prev, loading: true, modalOpen: false }));

    const {
      names, lastnames, dni, mail, phone_number, password
    } = formData;

    try {
      const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names,
          lastnames,
          dni,
          mail,
          password,
          phone_number,
        })
      });

      const responseJson = await response.json();
      if (!responseJson.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: responseJson.message,
        });
        return;
      }

      
      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: 'Bienvenido!!',
        html: "Usuario registrado exitosamente",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
      });
      router.push('/login');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    } finally {
      setFormData((prev) => ({ ...prev, loading: false }));
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <ClienteLayout>
      <div className="rounded-[10px] bg-white px-10 py-40 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <section>
                <div className="container">
                  <div
                    className="wow fadeInUp relative mx-auto max-w-[700px] overflow-hidden rounded-lg bg-white px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]"
                    data-wow-delay=".15s"
                  >
                    <form onSubmit={handleSubmit}>
                      {/* Form Fields */}
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Nombre:
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="names"
                          placeholder="Nombres"
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Apellidos:
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastnames"
                          placeholder="Apellidos"
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Correo:
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="email"
                          name="mail"
                          placeholder="Correo"
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Contraseña:
                          <span className="text-red">*</span>
                        </label>
                        <Popover
                          placement="right"
                          title={<span className="text-lg">Información</span>}
                          content={
                            <div className="p-2">
                              <Typography
                                color="textPrimary"
                                className="text-gray-700 dark:text-white"
                              >
                                Tu contraseña debe cumplir con:
                              </Typography>
                              <ul className="text-sm text-gray-700">
                                <li>Al menos 8 caracteres</li>
                                <li>Al menos una letra minúscula</li>
                                <li>Al menos una letra mayúscula</li>
                                <li>Al menos un número</li>
                              </ul>
                            </div>
                          }
                        >
                          <div className="relative">
                            <input
                              type="password"
                              name="password"
                              placeholder="Contraseña"
                              onChange={handleInputChange}
                              required
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                            <div className="absolute bottom-3 right-2 text-lg text-dark-6 dark:text-dark-4">
                              <InfoOutlinedIcon />
                            </div>
                          </div>
                          <small>{passwordStrength}</small>
                        </Popover>
                      </div>
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Confirmar contraseña:
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirmar contraseña"
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Cédula:
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="number"
                          name="dni"
                          placeholder="Cédula"
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="mb-[22px]">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                          Celular:
                          <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone_number"
                          placeholder="Número de teléfono"
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="mb-9">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.acceptedTerms}
                              onChange={handleCheckboxChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label="Acepto los términos y condiciones"
                        />
                      </div>
                      <div className="mb-9">
                        <button
                          type="submit"
                          className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
                          disabled={formData.loading || !formData.acceptedTerms}
                        >
                          {formData.loading ? "REGISTRANDO..." : "Crear cuenta"}
                        </button>
                      </div>
                    </form>
                    <p className="text-body-secondary text-base">
                      ¿Estás registrado?{" "}
                      <Link
                        href="/login"
                        className="text-primary hover:underline"
                      >
                        Ingresar
                      </Link>
                    </p>
                    {/* Modal for verification code */}
                    <Modal
                      isOpen={formData.modalOpen}
                      onClose={() =>
                        setFormData((prev) => ({ ...prev, modalOpen: false }))
                      }
                      onSubmit={handleModalSubmit}
                      data={{ mail: formData.mail }}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="mb-15 hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-1.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/LogoCompletoNegativo.png"}
                  alt="Logo"
                  width={400}
                  height={100}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/LogoCompleto.png"}
                  alt="Logo"
                  width={400}
                  height={100}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Regístrate para obtener tu Cuenta
              </p>
              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                ¡Bienvenido!
              </h1>
              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Regístrate completando todos los datos a continuación
              </p>
              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
  
};

export default Register;
