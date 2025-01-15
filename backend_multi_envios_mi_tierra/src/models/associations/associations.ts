import { Caja } from '../tblCaja';
import { Cliente } from '../tblOpClientes';
import { Correo } from '../tblCorreos';
import { DatosEnvio } from '../tblDatosEnvios';
import { Departamento } from '../tblDepartamentos';
import { Descuento } from '../tblDescuentos';
import { Direccion } from '../tblDirecciones';
import { Estado } from '../tblEstados';
import { Genero } from '../tblGenero';
import { Bitacora } from '../tblMsBitacora';
import { Objeto } from '../tblMsObjetos';
import { Parametro } from '../tblMsParametros';
import { Permiso } from '../tblMsPermisos';
import { Rol } from '../tblMsRoles';
import { Usuario } from '../tblMsUsuarios';
import { Municipio } from '../tblMunicipios';
import { Pais } from '../tblPaises';
import { Paquete } from '../tblPaquetes';
import { Persona } from '../tblPersonas';
import { Precio } from '../tblPrecios';
import { Telefono } from '../tblTelefonos';
import { TipoDescuento } from '../tblTipoDescuentos';

// Definición de relaciones

// Persona
// Relación Persona con Genero, País, Departamento y Municipio
Persona.belongsTo(Genero, { foreignKey: 'FK_COD_GENERO' });
Persona.belongsTo(Pais, { foreignKey: 'FK_COD_PAIS' });
Persona.belongsTo(Departamento, { foreignKey: 'FK_COD_DEPARTAMENTO' });
Persona.belongsTo(Municipio, { foreignKey: 'FK_COD_MUNICIPIO' });

// Relación Persona con Teléfonos y Correos (una persona puede tener varios)
Persona.hasMany(Telefono, { foreignKey: 'FK_COD_PERSONA' });
Persona.hasMany(Correo, { foreignKey: 'FK_COD_PERSONA' });

// Teléfonos y Correos pertenecen a una Persona
Telefono.belongsTo(Persona, { foreignKey: 'FK_COD_PERSONA' });
Correo.belongsTo(Persona, { foreignKey: 'FK_COD_PERSONA' });

// Otras relaciones (Dirección, Usuario, Cliente)
Persona.hasMany(Direccion, { foreignKey: 'FK_COD_PERSONA' });
Persona.hasMany(Usuario, { foreignKey: 'FK_COD_PERSONA' });
Persona.hasMany(Cliente, { foreignKey: 'FK_COD_PERSONA' });



// Direccion
Direccion.belongsTo(Municipio, { foreignKey: 'FK_COD_MUNICIPIO' });
Direccion.belongsTo(Persona, { foreignKey: 'FK_COD_PERSONA' });

// Usuario
Usuario.belongsTo(Rol, { foreignKey: 'FK_COD_ROL' });
Usuario.belongsTo(Persona, { foreignKey: 'FK_COD_PERSONA' });

// Precio
Precio.belongsTo(Pais, { foreignKey: 'FK_COD_PAIS' });
Precio.hasMany(Caja, { foreignKey: 'FK_COD_PRECIO' });

// Caja
Caja.belongsTo(Precio, { foreignKey: 'FK_COD_PRECIO' });
Caja.hasMany(Paquete, { foreignKey: 'FK_COD_CAJA' });

// Descuento
Descuento.belongsTo(TipoDescuento, { foreignKey: 'FK_COD_TIPO_DESCUENTO' });

// Cliente
Cliente.belongsTo(Persona, { foreignKey: 'FK_COD_PERSONA' });
Cliente.hasMany(DatosEnvio, { foreignKey: 'FK_COD_CLIENTE' });
Cliente.hasMany(Paquete, { foreignKey: 'FK_COD_CLIENTE' });

// DatosEnvio
DatosEnvio.belongsTo(Cliente, { foreignKey: 'FK_COD_CLIENTE' });
DatosEnvio.belongsTo(Pais, { as: 'PaisOrigen', foreignKey: 'FK_COD_PAIS_ORIGEN' });
DatosEnvio.belongsTo(Pais, { as: 'PaisDestino', foreignKey: 'FK_COD_PAIS_DESTINO' });
DatosEnvio.belongsTo(Departamento, { foreignKey: 'FK_COD_DEPARTAMENTO' });
DatosEnvio.belongsTo(Municipio, { foreignKey: 'FK_COD_MUNICIPIO' });
DatosEnvio.belongsTo(Direccion, { foreignKey: 'FK_COD_DIRECCION' });
DatosEnvio.belongsTo(Persona, { foreignKey: 'FK_COD_PERSONA' });
DatosEnvio.hasMany(Paquete, { foreignKey: 'FK_COD_ENVIO' });

// Paquete
Paquete.belongsTo(Caja, { foreignKey: 'FK_COD_CAJA' });
Paquete.belongsTo(Estado, { foreignKey: 'FK_COD_ESTADO' });
Paquete.belongsTo(Cliente, { foreignKey: 'FK_COD_CLIENTE' });
Paquete.belongsTo(DatosEnvio, { foreignKey: 'FK_COD_ENVIO' });

export {
  Caja,
  Cliente,
  Correo,
  DatosEnvio,
  Departamento,
  Descuento,
  Direccion,
  Estado,
  Genero,
  Bitacora,
  Objeto,
  Parametro,
  Permiso,
  Rol,
  Usuario,
  Municipio,
  Pais,
  Paquete,
  Persona,
  Precio,
  Telefono,
  TipoDescuento
};
