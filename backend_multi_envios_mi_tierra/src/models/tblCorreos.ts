import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface CorreoAttributes {
  COD_CORREO: number;
  FK_COD_PERSONA: number;
  CORREO: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface CorreoCreationAttributes extends Optional<CorreoAttributes, 'COD_CORREO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Correo extends Model<CorreoAttributes, CorreoCreationAttributes> implements CorreoAttributes {
  public COD_CORREO!: number;
  public FK_COD_PERSONA!: number;
  public CORREO!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Correo.init(
  {
    COD_CORREO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_PERSONA: {
      type: DataTypes.BIGINT,
    },
    CORREO: {
      type: DataTypes.STRING(50),
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
    tableName: 'TBL_CORREOS',
    timestamps: false,
  }
);

export { Correo };
