import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar el archivo .env
config({ path: resolve('./.env') });

// Tipado de variables de entorno (opcional)
export const JWTSECRET: string | undefined = process.env.JWTSECRET;
export const JWTSECRETPASSWORD: string | undefined = process.env.JWTSECRETPASSW;
export const API_FRONT: string | undefined = process.env.API_FRONT;
export const API_BACK: string | undefined = process.env.API_BACK;
export const PORT_FRONT: string | undefined = process.env.PORT_FRONT;
export const PORT_DB: string | undefined = process.env.PORT_DB;
export const HOST: string | undefined = process.env.HOST;
export const PORT: string | undefined = process.env.PORT;
export const PASSWORD: string | undefined = process.env.PASSWORD;
export const USER: string | undefined = process.env.USER;
export const DIALECT: string | undefined = process.env.DIALECT;
export const DATABASE: string | undefined = process.env.DATABASE;
export const NAME: string | undefined = process.env.NAME;
export const MAIL_HOST: string | undefined = process.env.MAIL_HOST;
export const MAIL_PORT: string | undefined = process.env.MAIL_PORT;
export const MAIL_USERNAME: string | undefined = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD: string | undefined = process.env.MAIL_PASSWORD;
export const MAIL_FROM_ADDRESS: string | undefined = process.env.MAIL_FROM_ADDRESS;
export const TWILIO_ACCOUNT_SID: string | undefined = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN: string | undefined = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER: string | undefined = process.env.TWILIO_PHONE_NUMBER;
export const PAPAL_API_CLIENTE: string | undefined = process.env.PAPAL_API_CLIENTE;
export const PAPAL_API_SECRET: string | undefined = process.env.PAPAL_API_SECRET;
export const PAPAL_API: string | undefined = process.env.PAPAL_API;
