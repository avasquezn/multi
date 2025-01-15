import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface ObjetoAttributes {
  COD_OBJETO: number;
  NOM_OBJETO: string;
  DES_OBJETO: string;
  ESTADO: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface ObjetoCreationAttributes extends Optional<ObjetoAttributes, 'COD_OBJETO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Objeto extends Model<ObjetoAttributes, ObjetoCreationAttributes> implements ObjetoAttributes {
  public COD_OBJETO!: number;
  public NOM_OBJETO!: string;
  public DES_OBJETO!: string;
  public ESTADO!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Objeto.init(
  {
    COD_OBJETO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    NOM_OBJETO: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    DES_OBJETO: {
      type: DataTypes.STRING(100),
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
    tableName: 'TBL_MS_OBJETOS',
    timestamps: false,
  }
);

export { Objeto };
