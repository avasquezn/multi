import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface GeneroAttributes {
  COD_GENERO: number;
  GENERO: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface GeneroCreationAttributes extends Optional<GeneroAttributes, 'COD_GENERO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Genero extends Model<GeneroAttributes, GeneroCreationAttributes> implements GeneroAttributes {
  public COD_GENERO!: number;
  public GENERO!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Genero.init(
  {
    COD_GENERO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    GENERO: {
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
    tableName: 'TBL_GENEROS',
    timestamps: false,
  }
);

export { Genero };
