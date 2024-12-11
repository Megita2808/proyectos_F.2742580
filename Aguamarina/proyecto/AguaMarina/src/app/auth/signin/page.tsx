"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { validateLogin } from "@/api/validations/validate_login";
import LoaderFullScreen from "@/components/Loaders/LoaderFullScreen";
import { useAuth } from "@/context/AuthContext";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    mail: "",
    password: "",
  });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadPermissions, setLoadPermissions } = useAuth();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    }
  }, [router]);

  const validateFields = () => {
    if (!loginData.mail || !loginData.password) {
      return "Por favor, completa todos los campos.";
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(loginData.mail)) {
      return "El correo electrónico no es válido.";
    }
    return null;
  };

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationError = validateFields();
    if (validationError) {
      await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error de validación",
        html: validationError,
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
        },
      });
      setLoading(false);
      return;
    }

    try {
      const { data, result } = await validateLogin(loginData, setLoadingLogin);

      if (result) {
        let timerInterval: number | NodeJS.Timeout;

        if (data && data.accessDashboard) {
          await Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Bienvenido!",
            html: "Redirigiendo al Dashboard en <b>3</b> segundos...",
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
          setLoadPermissions(!loadPermissions)
          router.push("/admin");
        } else {
          await Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Bienvenido!",
            html: "Redirigiendo al inicio en <b>3</b> segundos...",
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

          router.push("/");
        }

        setLoadingLogin(true);
      } else {
        let errorMessage = "Error al iniciar sesión. Por favor, intenta de nuevo.";


        await Swal.fire({
          icon: "error",
          iconColor: "#000",
          color: "#000",
          title: "Error",
          html: errorMessage,
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: "custom-background",
          },
        });
      }

      setLoginData({ mail: "", password: "" });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "Error",
        html: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
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
                      <div className="wow fadeInUp relative mx-auto max-w-[700px] overflow-hidden rounded-lg bg-white px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]" data-wow-delay=".15s">
                        <form onSubmit={loginUser}>
                          <div className="mb-[22px]">
                            <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                              Correo:
                              <span className="text-red">*</span>
                            </label>
                            <input
                              type="email"
                              placeholder="Correo"
                              value={loginData.mail}
                              onChange={(e) => setLoginData({ ...loginData, mail: e.target.value })}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                              required
                            />
                          </div>
                          <div className="mb-[22px]">
                            <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                              Contraseña:
                              <span className="text-red">*</span>
                            </label>
                            <input
                              type="password"
                              placeholder="Contraseña"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                              required
                            />
                          </div>
                          <div className="mb-9">
                            <button
                              type="submit"
                              className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
                              Ingresar 
                            </button>
                          </div>
                        </form>

                        <Link href="/recoverPassword" className="mb-2 inline-block text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary">
                          Perdiste tu contraseña?
                        </Link>
                        <p className="text-body-secondary text-base">
                          No estás registrado?{" "}
                          <Link href="/registrarme" className="text-primary hover:underline">Regístrate</Link>
                        </p>
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
                Inicia sesión en tu cuenta  
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Bienvenido!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Inicie sesión en su cuenta completando los campos necesarios a continuación
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
        {loadingLogin && <LoaderFullScreen />}
      </div>
    </ClienteLayout>
  );
};

export default SignIn;
