import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Define el tipo de las variables de entorno que vas a utilizar
interface MailConfig {
    MAIL_HOST: string;
    MAIL_PORT: string; // Debe ser string para la configuración
    MAIL_SECURE: boolean; 
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
}

// Asegúrate de que todas las variables de entorno estén definidas
const mailConfig: MailConfig = {
    MAIL_HOST: process.env.MAIL_HOST || '', // Proporciona un valor predeterminado o maneja el error
    MAIL_PORT: process.env.MAIL_PORT || '587', // Por defecto 587
    MAIL_SECURE: process.env.MAIL_SECURE === 'true', 
    MAIL_USERNAME: process.env.MAIL_USERNAME || '', // Proporciona un valor predeterminado o maneja el error
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '', // Proporciona un valor predeterminado o maneja el error
};

// Verifica si las variables obligatorias están configuradas
if (!mailConfig.MAIL_HOST || !mailConfig.MAIL_USERNAME || !mailConfig.MAIL_PASSWORD) {
    throw new Error('Las variables de entorno son obligatorias.');
}

// Crea el transportador de nodemailer
export const transport: Transporter = nodemailer.createTransport({
    host: mailConfig.MAIL_HOST,
    port: parseInt(mailConfig.MAIL_PORT, 587), // Asegúrate de convertir a número
    secure: mailConfig.MAIL_SECURE,
    auth: {
        user: mailConfig.MAIL_USERNAME,
        pass: mailConfig.MAIL_PASSWORD,
    },
});

// Obtén el año actual
const currentYear: number = new Date().getFullYear();

//   export const transportResetPassword = (nombre: string, email: string, token: string) => {
//     return {
//       from: `${process.env.MAIL_FROM_ADDRESS}`,
//       to: `${email}`,
//       subject: "Restablecer contraseña",
//       html: `
//         <!DOCTYPE html>
//         <html lang="es">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Restablecer contraseña</title>
//           <style>
//             body {
//               font-family: 'Arial', sans-serif;
//               background-color: #f4f7f9;
//               margin: 0;
//               padding: 0;
//             }
//             .container {
//               max-width: 600px;
//               margin: 40px auto;
//               background-color: #ffffff;
//               border-radius: 8px;
//               overflow: hidden;
//               box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
//             }
//             .header {
//               background-color: #3498db;
//               color: #ffffff;
//               padding: 30px;
//               text-align: center;
//             }
//             .header h1 {
//               margin: 0;
//               font-size: 28px;
//               font-weight: bold;
//             }
//             .content {
//               padding: 40px;
//               color: #333333;
//             }
//             .content h2 {
//               color: #2c3e50;
//               font-size: 24px;
//               margin-bottom: 20px;
//             }
//             .content p {
//               line-height: 1.6;
//               margin-bottom: 20px;
//             }
//             .button {
//               display: inline-block;
//               padding: 10px 20px;
//               background-color: #007bff; /* Color del botón */
//               color: white;
//               text-decoration: none;
//               text-align: center;
//               border-radius: 5px;
//               font-size: 16px;
//               transition: background-color 0.3s ease;
//             }
//             .button:hover {
//               background-color: #2980b9;
//               transform: translateY(-2px);
//               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//             }
//             .footer {
//               background-color: #34495e;
//               color: #ecf0f1;
//               text-align: center;
//               padding: 20px;
//               font-size: 14px;
//             }
//             .footer a {
//               color: #3498db;
//               text-decoration: none;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>Multi envios mi tierrra</h1>
//             </div>
//             <div class="content">
//               <h2>Hola, ${nombre}</h2>
//               <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo para continuar con el proceso.</p>
//               <form action="${process.env.API_FRONT}:${process.env.PORT_FRONT}/auth/resetPassword" method="POST">
//                 <input type="hidden" name="reset_token" value="${token}" />
//                 <button type="submit" class="button">
//                   Restablecer contraseña
//                 </button>
//               </form>
//               <p>Este enlace expira en 1 hora.</p>
//             </div>
//             <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} ${process.env.NAME}. Todos los derechos reservados.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//     };
// };

export const transportResetPassword = (nombre: string, email: string, token: string) => {
  // Encriptamos el token en base64 para mayor seguridad
  const encodedToken = Buffer.from(token).toString('base64');
  
  return {
    from: `${process.env.MAIL_FROM_ADDRESS}`,
    to: `${email}`,
    subject: "Restablecer contraseña",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña</title>
           <style>
             body {
               font-family: 'Arial', sans-serif;
               background-color: #f4f7f9;
               margin: 0;
               padding: 0;
             }
             .container {
               max-width: 600px;
               margin: 40px auto;
               background-color: #ffffff;
               border-radius: 8px;
               overflow: hidden;
               box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
             }
             .header {
               background-color: #3498db;
               color: #ffffff;
               padding: 30px;
               text-align: center;
             }
             .header h1 {
               margin: 0;
               font-size: 28px;
               font-weight: bold;
             }
             .content {
               padding: 40px;
               color: #333333;
             }
             .content h2 {
               color: #2c3e50;
               font-size: 24px;
               margin-bottom: 20px;
             }
             .content p {
               line-height: 1.6;
               margin-bottom: 20px;
             }
             .button {
               display: inline-block;
               padding: 10px 20px;
               background-color: #007bff; /* Color del botón */
               color: white;
               text-decoration: none;
               text-align: center;
               border-radius: 5px;
               font-size: 16px;
               transition: background-color 0.3s ease;
             }
             .button:hover {
               background-color: #2980b9;
               transform: translateY(-2px);
               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
             }
             .footer {
               background-color: #34495e;
               color: #ecf0f1;
               text-align: center;
               padding: 20px;
               font-size: 14px;
             }
             .footer a {
               color: #3498db;
               text-decoration: none;
             }
           </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Multi envios mi tierrra</h1>
          </div>
          <div class="content">
            <h2>Hola, ${nombre}</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo para continuar con el proceso.</p>
            <a href="${process.env.API_FRONT}:${process.env.PORT_FRONT}/auth/resetPassword?state=${encodedToken}" 
               class="button" 
               style="color: white; text-decoration: none;">
              Restablecer contraseña
            </a>
            <p>Este enlace expira en 1 hora.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};