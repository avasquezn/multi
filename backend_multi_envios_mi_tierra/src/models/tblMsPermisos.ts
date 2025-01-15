import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Rol } from './tblMsRoles'; // Ajusta la ruta según tu estructura de proyecto
import { Objeto } from './tblMsObjetos'; // Ajusta la ruta según tu estructura de proyecto

interface PermisoAttributes {
  COD_PERMISO: number;
  FK_COD_ROL: number;
  FK_COD_OBJETO: number;
  DES_PERMISO_INSERCCION: number;
  DES_PERMISO_ELIMINACION: number;
  DES_PERMISO_ACTUALIZACION: number;
  DES_PERMISO_CONSULTAR: number;
  PERMISO_REPORTE: number;
  ESTADO: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface PermisoCreationAttributes extends Optional<PermisoAttributes, 'COD_PERMISO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Permiso extends Model<PermisoAttributes, PermisoCreationAttributes> implements PermisoAttributes {
  public COD_PERMISO!: number;
  public FK_COD_ROL!: number;
  public FK_COD_OBJETO!: number;
  public DES_PERMISO_INSERCCION!: number;
  public DES_PERMISO_ELIMINACION!: number;
  public DES_PERMISO_ACTUALIZACION!: number;
  public DES_PERMISO_CONSULTAR!: number;
  public PERMISO_REPORTE!: number;
  public ESTADO!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Permiso.init(
  {
    COD_PERMISO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_ROL: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Rol,
        key: 'COD_ROL',
      },
    },
    FK_COD_OBJETO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Objeto,
        key: 'COD_OBJETO',
      },
    },
    DES_PERMISO_INSERCCION: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DES_PERMISO_ELIMINACION: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DES_PERMISO_ACTUALIZACION: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DES_PERMISO_CONSULTAR: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PERMISO_REPORTE: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ESTADO: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    USR_CREO: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    FEC_CREACION: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    USR_MODIFICO: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    FEC_MODIFICO: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'TBL_MS_PERMISOS',
    timestamps: false,
  }
);

export { Permiso };
