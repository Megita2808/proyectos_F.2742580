// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { fetchUserById } from './api/fetchs/get_usuarios';

// interface JwtPayload {
//     id_user: number;
//     id_rol: number;
//   }

// export async function middleware(req: NextRequest) {
    
//     const token = req.cookies.get('token')?.value || "";
//     // console.log({token})
    

//     if (!token) {
//         // Redirigir si la cookie no está presente
//         return NextResponse.redirect(new URL('/login', req.url));
//     }else {
//         const payload = jwt.decode(token) as JwtPayload;
//         const dataUser = await fetchUserById(payload.id_user);
//         if (!dataUser.accessDashboard)
//             return NextResponse.redirect(new URL('/login', req.url));
//     }

//   return NextResponse.next();
// }

// export const config = {
//     matcher: ['/admin/:path*']
// };


// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { fetchUserById } from './api/fetchs/get_usuarios';
import { checkToken } from './api/validations/check_cookie';

interface JwtPayload {
  id_user: number;
  id_rol: number;
  canAccessFeature?: boolean;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value || "";

  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));  // Si no hay token, redirigir al login
  }

  const payload = jwt.decode(token) as JwtPayload;
  // Middleware para rutas de administración
  if (pathname.startsWith('/admin')) {
    const user = await fetchUserById(payload.id_user);
    if (!user || user.accessDashboard == false) {  // Verificar si el usuario tiene acceso a la administración
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // if (pathname.startsWith('/pedido')) {
  //   const carrito = localStorage.getItem('cart');
  //   const dates = sessionStorage.getItem('dates');
  //   if(!carrito || !dates) {
  //       return NextResponse.redirect(new URL('/', req.url)); //Cambiar para poner alerta de que no hay productos en el carrito
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path*',
  ]
};
