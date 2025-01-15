import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto

interface TipoDescuentoAttributes {
  COD_TIPO_DESCUENTO: number;
  DETALLE: string;
  ES_PORCENTAJE: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface TipoDescuentoCreationAttributes extends Optional<TipoDescuentoAttributes, 'COD_TIPO_DESCUENTO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class TipoDescuento extends Model<TipoDescuentoAttributes, TipoDescuentoCreationAttributes> implements TipoDescuentoAttributes {
  public COD_TIPO_DESCUENTO!: number;
  public DETALLE!: string;
  public ES_PORCENTAJE!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

TipoDescuento.init(
  {
    COD_TIPO_DESCUENTO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    DETALLE: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ES_PORCENTAJE: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'TBL_TIPO_DESCUENTOS',
    timestamps: false,
  }
);

export { TipoDescuento };
