import {config} from 'dotenv';

config();

//Variables Base de Datos MySQL (Deprecados)
export const PORT = process.env.PORT;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT ;
export const DB_USER = process.env.DB_USER ;
export const DB_PASSWORD = process.env.DB_PASSWORD ;
export const DB_DATABASE = process.env.DB_DATABASE ;

//Variables de Neon PostgreSQL
export const PGHOST = process.env.PGHOST;
export const PGDATABASE = process.env.PGHOST;
export const PGUSER = process.env.PGUSER;
export const PGPASSWORD = process.env.PGPASSWORD;

//Variables de Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dygettihd';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '755195246975729';
export const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY || 'S6sF1Uww5dq38gdcRHUBzJuNJl8';

//Variables Secretas JWT
export const SECRET_JWT = process.env.SECRET_JWT || "ClaveSecreta";

//Variables Secretas GMAIL
export const USER_GMAIL = process.env.USER_GMAIL;
export const PASS_APP_GMAIL = process.env.PASS_APP_GMAIL;

//Variables de FrontEnd
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

export const PRODUCTS_ENDPOINT = process.env.PRODUCTS_ENDPOINT;