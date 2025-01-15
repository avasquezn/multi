import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Precio } from './tblPrecios'; // Ajusta la ruta según tu estructura de proyecto

interface CajaAttributes {
  COD_CAJA: number;
  FK_COD_PRECIO: number;
  ID_CAJA: string;
  DETALLE: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface CajaCreationAttributes extends Optional<CajaAttributes, 'COD_CAJA' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Caja extends Model<CajaAttributes, CajaCreationAttributes> implements CajaAttributes {
  public COD_CAJA!: number;
  public FK_COD_PRECIO!: number;
  public ID_CAJA!: string;
  public DETALLE!: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Caja.init(
  {
    COD_CAJA: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_PRECIO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Precio,
        key: 'COD_PRECIO',
      },
    },
    ID_CAJA: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DETALLE: {
      type: DataTypes.STRING(255),
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
    tableName: 'TBL_CAJAS',
    timestamps: false,
  }
);

export { Caja };
