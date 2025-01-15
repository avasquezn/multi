import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { TipoDescuento } from './tblTipoDescuentos'; // Ajusta la ruta según tu estructura de proyecto

interface DescuentoAttributes {
  COD_DESCUENTO: number;
  FK_COD_TIPO_DESCUENTO: number;
  NOMBRE: string;
  CANTIDAD: number;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface DescuentoCreationAttributes extends Optional<DescuentoAttributes, 'COD_DESCUENTO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Descuento extends Model<DescuentoAttributes, DescuentoCreationAttributes> implements DescuentoAttributes {
  public COD_DESCUENTO!: number;
  public FK_COD_TIPO_DESCUENTO!: number;
  public NOMBRE!: string;
  public CANTIDAD!: number;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Descuento.init(
  {
    COD_DESCUENTO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_TIPO_DESCUENTO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: TipoDescuento,
        key: 'COD_TIPO_DESCUENTO',
      },
    },
    NOMBRE: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    CANTIDAD: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'TBL_DESCUENTOS',
    timestamps: false,
  }
);

export { Descuento };
