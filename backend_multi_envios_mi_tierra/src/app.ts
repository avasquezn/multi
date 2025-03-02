import express, { json, urlencoded } from 'express';
import cors  from 'cors';
import authRoutes from './routes/authRoutes';
import locationRoutes from './routes/locationRoutes';
import passResetRoutes from './routes/passResetRoutes';
import rolsRoutes from './routes/rolsRoutes';
import objectsRoutes from './routes/objectsRoutes';
import permissionsRoutes from './routes/permissionsRoutes';
import usersRoutes from './routes/usersRoutes';
import generosRoutes from './routes/generosRoutes';
import priceRoutes from './routes/PreciosRoutes';
import cajasRoutes from './routes/cajasRoutes';
import descuentosRoutes from './routes/descuentosRoutes';
import clientesRoutes from './routes/clientesRoutes';
import datosRoutes from './routes/datosEnvioRoutes';
import paqueteRoute from './routes/paqueteRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import destinatariosRoutes from './routes/destinatariosRoutes';

const app = express();

// Otros Middlewares
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/reset', passResetRoutes);
app.use('/api/roles', rolsRoutes);
app.use('/api/objects', objectsRoutes);
app.use('/api/permisos', permissionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/genders', generosRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/boxes', cajasRoutes);
app.use('/api/descuentos', descuentosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/datos-envio', datosRoutes);
app.use('/api/paquetes', paqueteRoute);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/destinatarios', destinatariosRoutes);

export default app;
