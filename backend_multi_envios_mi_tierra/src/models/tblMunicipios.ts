import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Departamento } from './tblDepartamentos'; // Ajusta la ruta según tu estructura de proyecto

interface MunicipioAttributes {
  COD_MUNICIPIO: number;
  FK_COD_DEPARTAMENTO: number;
  NOM_MUNICIPIO: string;
  ID_POSTAL?: string;
  ESTADO: boolean;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface MunicipioCreationAttributes extends Optional<MunicipioAttributes, 'COD_MUNICIPIO' | 'ID_POSTAL' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Municipio extends Model<MunicipioAttributes, MunicipioCreationAttributes> implements MunicipioAttributes {
  public COD_MUNICIPIO!: number;
  public FK_COD_DEPARTAMENTO!: number;
  public NOM_MUNICIPIO!: string;
  public ID_POSTAL?: string;
  public ESTADO!: boolean;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Municipio.init(
  {
    COD_MUNICIPIO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_DEPARTAMENTO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Departamento,
        key: 'COD_DEPARTAMENTO',
      },
    },
    NOM_MUNICIPIO: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    ID_POSTAL: {
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
    tableName: 'TBL_MUNICIPIOS',
    timestamps: false,
  }
);

export { Municipio };
