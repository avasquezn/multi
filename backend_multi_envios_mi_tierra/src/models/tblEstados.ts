import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

interface EstadoAttributes {
  COD_ESTADO: number;
  TIP_ESTADO: string;
  DETALLE: string;
  ESTADO: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface EstadoCreationAttributes extends Optional<EstadoAttributes, 'COD_ESTADO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Estado extends Model<EstadoAttributes, EstadoCreationAttributes> implements EstadoAttributes {
  public COD_ESTADO!: number;
  public TIP_ESTADO!: string;
  public DETALLE!: string;
  public ESTADO!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Estado.init(
  {
    COD_ESTADO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    TIP_ESTADO: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    DETALLE: {
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
    tableName: 'TBL_ESTADOS',
    timestamps: false,
  }
);

export { Estado };
