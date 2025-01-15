import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

// Función helper para verificar permisos
const checkPermission = (permisos, objectName) => {
  const permission = permisos?.find(permiso => permiso.objectName === objectName);
  return permission?.canView === 1;
};

// Función que genera los items del menú basado en los permisos
const getMenuItems = (permisos = []) => {
  const baseItems = [
    {
      navlabel: true,
      subheader: 'Home',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconLayoutDashboard,
      href: '/dashboard',
    },
  ];

  if (checkPermission(permisos, 'Paises')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Paises',
      icon: IconLayoutDashboard,
      href: '/paises',
    });
  }

  if (checkPermission(permisos, 'Roles')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Roles',
      icon: IconLayoutDashboard,
      href: '/roles',
    });
  }

  if (checkPermission(permisos, 'Objetos')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Objetos',
      icon: IconLayoutDashboard,
      href: '/objetos',
    });
  }

  if (checkPermission(permisos, 'Permisos')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Permisos',
      icon: IconLayoutDashboard,
      href: '/permisos',
    });
  }

  if (checkPermission(permisos, 'Usuarios')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Usuarios',
      icon: IconLayoutDashboard,
      href: '/usuarios',
    });
  }

  if (checkPermission(permisos, 'Géneros')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Géneros',
      icon: IconLayoutDashboard,
      href: '/generos',
    });
  }

  if (checkPermission(permisos, 'Precios')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Precios',
      icon: IconLayoutDashboard,
      href: '/precios',
    });
  }

  if (checkPermission(permisos, 'Cajas')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Cajas',
      icon: IconLayoutDashboard,
      href: '/cajas',
    });
  }

  if (checkPermission(permisos, 'Tipo de descuentos')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Tipo de descuentos',
      icon: IconLayoutDashboard,
      href: '/tipo-descuento',
    });
  }

  if (checkPermission(permisos, 'Descuentos')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Descuentos',
      icon: IconLayoutDashboard,
      href: '/descuentos',
    });
  }

  if (checkPermission(permisos, 'Clientes')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Clientes',
      icon: IconLayoutDashboard,
      href: '/clientes',
    });
  }

  if (checkPermission(permisos, 'Envios')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Envios',
      icon: IconLayoutDashboard,
      href: '/envios',
    });
  }

  if (checkPermission(permisos, 'Paquetes')) {
    baseItems.push({
      id: uniqueId(),
      title: 'Paquetes',
      icon: IconLayoutDashboard,
      href: '/paquetes',
    });
  }


  // Resto de items que no requieren permisos especiales
  return [...baseItems];
};

export { getMenuItems };