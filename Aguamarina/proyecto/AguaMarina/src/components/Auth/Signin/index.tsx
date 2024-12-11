"use client";
import Link from "next/link";
import React from "react";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <div className="m-25">

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center text-xl font-medium dark:bg-gray-dark">
          Inicia Sesión con tu Correo Electrónico
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          No tienes una cuenta?{" "}
          <Link href="/auth/signup" className="text-primary">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
