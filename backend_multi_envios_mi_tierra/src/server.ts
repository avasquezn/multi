import dotenv from 'dotenv';
dotenv.config();  // Cargar las variables del .env

import app from './app';  // Importamos la configuración de Express desde app.ts
import { connectDB } from './config/database/index';
import './models/associations/associations'

// Conectar a la base de datos
connectDB();

// Configurar el puerto desde el .env o usar el puerto 4000 por defecto
const portApit: number = parseInt(process.env.PORT || '4000', 10);

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(portApit, () => {
  console.log(`Servidor corriendo en el puerto ${portApit}`);
});
