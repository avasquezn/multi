import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './ProtectedRoutes';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Paises = Loadable(lazy(() => import('../views/locations/Locations')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/forgotPassword/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/resetPassword/ResetPassword')));
const Roles = Loadable(lazy(() => import('../views/security/Rols/Rol')));
const Objetos = Loadable(lazy(() => import('../views/security/Objects/Objects')));
const Permisos = Loadable(lazy(() => import('../views/security/Permissions/Permissions')));
const Usuarios = Loadable(lazy(() => import('../views/users/Users')));
const Generos = Loadable(lazy(() => import('../views/generos/Generos')));
const Precios = Loadable(lazy(() => import('../views/prices/Prices')));
const Cajas = Loadable(lazy(() => import('../views/cajas/Box')));
const TipoDescuentos = Loadable(lazy(() => import('../views/tipoDescuentos/TipoDescuento')));
const Descuentos = Loadable(lazy(() => import('../views/descuentos/Descuentos')));
const Clientes = Loadable(lazy(() => import('../views/clientes/Clientes')));
const Envios = Loadable(lazy(() => import('../views/envios/Envios')));
const Paquetes = Loadable(lazy(() => import('../views/paquetes/Paquetes')));


const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/auth/login" /> },
      { path: '/dashboard', exact: true, element: <ProtectedRoute element={<Dashboard />} /> },
      { path: '/paises', exact: true, element: <ProtectedRoute element={<Paises />} /> },
      { path: '/roles', exact: true, element: <ProtectedRoute element={<Roles />} /> },
      { path: '/objetos', exact: true, element: <ProtectedRoute element={<Objetos />} /> },
      { path: '/permisos', exact: true, element: <ProtectedRoute element={<Permisos />} /> },
      { path: '/usuarios', exact: true, element: <ProtectedRoute element={<Usuarios />} /> },
      { path: '/generos', exact: true, element: <ProtectedRoute element={<Generos />} /> },
      { path: '/precios', exact: true, element: <ProtectedRoute element={<Precios />} /> },
      { path: '/cajas', exact: true, element: <ProtectedRoute element={<Cajas />} /> },
      { path: '/tipo-descuento', exact: true, element: <ProtectedRoute element={<TipoDescuentos />} /> },
      { path: '/descuentos', exact: true, element: <ProtectedRoute element={<Descuentos />} /> },
      { path: '/clientes', exact: true, element: <ProtectedRoute element={<Clientes />} />},
      { path: '/envios', exact: true, element: <ProtectedRoute element={<Envios />} />},
      { path: '/paquetes', exact: true, element: <ProtectedRoute element={<Paquetes />} />},
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/forgotPassword', element: <ForgotPassword /> },
      { path: '/auth/resetPassword', element: <ResetPassword /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
