"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import Image from "next/image";
import Link from "next/link";

const RecoverPassword: React.FC = () => {
  const [recoverMail, setRecoverMail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recoverMail.trim()) {
      await Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: "Error!",
        html: "El correo electrónico es obligatorio <b>3</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
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
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: recoverMail }),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Error en la solicitud de recuperación.');
      }

      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: 'Valido!!',
        html: "se envio a tu correo un mensaje!!",
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

      setRecoverMail(""); // Reset email field
    } catch (error: any) {
      console.error('Error:', error);
      await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html: "Hubo un problema al recuperar tu contraseña!",
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClienteLayout>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card px-10">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full sm:p-12.5 xl:p-15 p-4">
              <section>
                <div className="container">
                  <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                      <div className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]" data-wow-delay=".15s">
                        <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recuperar Contraseña</h2>
                        <form onSubmit={handleRecoverPassword}>
                          <div className="mb-[22px]">
                          <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                              Correo:
                            <span className="text-red">*</span>
                            </label>
                            <input
                              type="email"
                              placeholder="Correo electrónico"
                              value={recoverMail}
                              onChange={(e) => setRecoverMail(e.target.value)}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                              required
                            />
                          </div>
                          <div className="mb-9">
                            <button
                              type="submit"
                              className={`mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={loading}
                            >
                              {loading ? 'Enviando...' : 'Enviar'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2 mt-50">
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
                Recupera tu contraseña 
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Bienvenido!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Recupera tu contraseña completando el siguiente campo
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

export default RecoverPassword;
