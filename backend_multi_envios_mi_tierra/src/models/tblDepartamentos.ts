import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Pais } from './tblPaises'; // Ajusta la ruta según tu estructura de proyecto

interface DepartamentoAttributes {
  COD_DEPARTAMENTO: number;
  FK_COD_PAIS: number;
  NOM_DEPARTAMENTO: string;
  ESTADO: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface DepartamentoCreationAttributes extends Optional<DepartamentoAttributes, 'COD_DEPARTAMENTO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Departamento extends Model<DepartamentoAttributes, DepartamentoCreationAttributes> implements DepartamentoAttributes {
  public COD_DEPARTAMENTO!: number;
  public FK_COD_PAIS!: number;
  public NOM_DEPARTAMENTO!: string;
  public ESTADO!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Departamento.init(
  {
    COD_DEPARTAMENTO: {
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
    NOM_DEPARTAMENTO: {
      type: DataTypes.STRING(50),
      unique: true,
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
    tableName: 'TBL_DEPARTAMENTOS',
    timestamps: false,
  }
);

export { Departamento };
