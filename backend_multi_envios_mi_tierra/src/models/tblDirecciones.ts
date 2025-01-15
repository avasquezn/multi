import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Municipio } from './tblMunicipios'; // Ajusta la ruta según tu estructura de proyecto
import { Persona } from './tblPersonas'; // Ajusta la ruta según tu estructura de proyecto

interface DireccionAttributes {
  COD_DIRECCION: number;
  FK_COD_PERSONA: number;
  FK_COD_MUNICIPIO: number;
  DIRECCION?: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface DireccionCreationAttributes extends Optional<DireccionAttributes, 'COD_DIRECCION' | 'DIRECCION' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Direccion extends Model<DireccionAttributes, DireccionCreationAttributes> implements DireccionAttributes {
  public COD_DIRECCION!: number;
  public FK_COD_PERSONA!: number;
  public FK_COD_MUNICIPIO!: number;
  public DIRECCION?: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Direccion.init(
  {
    COD_DIRECCION: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_PERSONA: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Persona,
        key: 'COD_PERSONA',
      },
    },
    FK_COD_MUNICIPIO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Municipio,
        key: 'COD_MUNICIPIO',
      },
    },
    DIRECCION: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'TBL_DIRECCIONES',
    timestamps: false,
  }
);

export { Direccion };
