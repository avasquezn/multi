import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Pais } from './tblPaises'; // Ajusta la ruta según tu estructura de proyecto

interface PrecioAttributes {
  COD_PRECIO: number;
  FK_COD_PAIS: number;
  PRECIO: number;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface PrecioCreationAttributes extends Optional<PrecioAttributes, 'COD_PRECIO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Precio extends Model<PrecioAttributes, PrecioCreationAttributes> implements PrecioAttributes {
  public COD_PRECIO!: number;
  public FK_COD_PAIS!: number;
  public PRECIO!: number;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Precio.init(
  {
    COD_PRECIO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_PAIS: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Pais,
        key: 'COD_PAIS',
      },
    },
    PRECIO: {
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
    tableName: 'TBL_PRECIOS',
    timestamps: false,
  }
);

export { Precio };
