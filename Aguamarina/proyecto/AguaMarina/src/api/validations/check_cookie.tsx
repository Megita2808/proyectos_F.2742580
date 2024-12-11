"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { fetchUserById } from "../fetchs/get_usuarios";

const SECRET_KEY = process.env.SECRET_JWT_AGUAMARINA || "";

interface TokenPayload {
  id_user: string;
  id_rol: string;
  [key: string]: any;
}

interface CheckTokenResponse {
  result: boolean;
  data?: any;
  error?: string;
}

export const checkToken = async (): Promise<CheckTokenResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { result: false, error: "No hay token en la cookie" };
    }

    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, SECRET_KEY) as TokenPayload;
    } catch (error) {
      console.error("Token inválido:", error);
      return { result: false, error: "Token inválido o expirado" };
    }

    try {
      const dataUser = await fetchUserById(payload.id_user);

      return { result: true, data: dataUser };
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return { result: false, error: "Error al obtener datos del usuario" };
    }
  } catch (error: any) {
    console.error("Error en checkToken:", error.message || error);
    return { result: false, error: error.message || "Error desconocido" };
  }
};
