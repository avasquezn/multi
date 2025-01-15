import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

interface RolAttributes {
  COD_ROL: number;
  NOM_ROL: string;
  DES_ROL: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
  ESTADO: boolean;
}

interface RolCreationAttributes extends Optional<RolAttributes, 'COD_ROL' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Rol extends Model<RolAttributes, RolCreationAttributes> implements RolAttributes {
  public COD_ROL!: number;
  public NOM_ROL!: string;
  public DES_ROL!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
  public ESTADO!: boolean;
}

Rol.init(
  {
    COD_ROL: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    NOM_ROL: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    DES_ROL: {
      type: DataTypes.STRING(100),
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
    ESTADO: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'TBL_MS_ROLES',
    timestamps: false,
  }
);

export { Rol };
