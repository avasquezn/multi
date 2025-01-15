import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface BitacoraAttributes {
  COD_BITACORA: number;
  FECHA: Date;
  USR_BITACORA: string;
  OBJ_BITACORA: string;
  ACCION: string;
  DESCRIPCION: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface BitacoraCreationAttributes extends Optional<BitacoraAttributes, 'COD_BITACORA' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Bitacora extends Model<BitacoraAttributes, BitacoraCreationAttributes> implements BitacoraAttributes {
  public COD_BITACORA!: number;
  public FECHA!: Date;
  public USR_BITACORA!: string;
  public OBJ_BITACORA!: string;
  public ACCION!: string;
  public DESCRIPCION!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Bitacora.init(
  {
    COD_BITACORA: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FECHA: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    USR_BITACORA: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    OBJ_BITACORA: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ACCION: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    DESCRIPCION: {
      type: DataTypes.STRING(1000),
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
    tableName: 'TBL_MS_BITACORA',
    timestamps: false,
  }
);

export { Bitacora };
