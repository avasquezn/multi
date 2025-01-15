import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface ParametroAttributes {
  COD_PARAMETRO: number;
  NOM_PARAMETRO: string;
  VAL_PARAMETRO: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICACION?: Date;
  ESTADO: boolean;
}

interface ParametroCreationAttributes extends Optional<ParametroAttributes, 'COD_PARAMETRO' | 'USR_MODIFICO' | 'FEC_MODIFICACION'> {}

class Parametro extends Model<ParametroAttributes, ParametroCreationAttributes> implements ParametroAttributes {
  public COD_PARAMETRO!: number;
  public NOM_PARAMETRO!: string;
  public VAL_PARAMETRO!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICACION?: Date;
  public ESTADO!: boolean;
}

Parametro.init(
  {
    COD_PARAMETRO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    NOM_PARAMETRO: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    VAL_PARAMETRO: {
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
    FEC_MODIFICACION: {
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
    tableName: 'TBL_MS_PARAMETROS',
    timestamps: false,
  }
);

export { Parametro };
