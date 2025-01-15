import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface PaisAttributes {
  COD_PAIS: number;
  NOM_PAIS: string;
  NUM_ZONA?: string;
  ESTADO: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface PaisCreationAttributes extends Optional<PaisAttributes, 'COD_PAIS' | 'NUM_ZONA' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Pais extends Model<PaisAttributes, PaisCreationAttributes> implements PaisAttributes {
  public COD_PAIS!: number;
  public NOM_PAIS!: string;
  public NUM_ZONA?: string;
  public ESTADO!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Pais.init(
  {
    COD_PAIS: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    NOM_PAIS: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: false,
    },
    NUM_ZONA: {
      type: DataTypes.STRING(20),
      allowNull: true,
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
    tableName: 'TBL_PAISES',
    timestamps: false,
  }
);

export { Pais };
