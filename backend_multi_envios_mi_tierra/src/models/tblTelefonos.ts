import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface TelefonoAttributes {
  COD_TELEFONO: number;
  FK_COD_PERSONA: number;
  TELEFONO: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface TelefonoCreationAttributes extends Optional<TelefonoAttributes, 'COD_TELEFONO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Telefono extends Model<TelefonoAttributes, TelefonoCreationAttributes> implements TelefonoAttributes {
  public COD_TELEFONO!: number;
  public FK_COD_PERSONA!: number;
  public TELEFONO!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Telefono.init(
  {
    COD_TELEFONO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_PERSONA: {
      type: DataTypes.BIGINT,
    },
    TELEFONO: {
      type: DataTypes.STRING(15),
      unique: true,
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
    tableName: 'TBL_TELEFONOS',
    timestamps: false,
  }
);

export { Telefono };
