"use server"
import { cookies } from "next/headers";

export async function setCookieToken(token: string) {
    const expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
    (await cookies()).set('token', token, { expires, httpOnly: true });
    return true;
}

export async function logOut() {
    const token = (await cookies()).get('token')?.value;

    if (token) {
        (await cookies()).delete('token');
        return true;
    }
}