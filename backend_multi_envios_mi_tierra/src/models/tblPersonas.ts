import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Genero } from './tblGenero'; // Ajusta la ruta según tu estructura de proyecto
import { Telefono } from './tblTelefonos'; // Ajusta la ruta según tu estructura de proyecto
import { Correo } from './tblCorreos'; // Ajusta la ruta según tu estructura de proyecto
import { Pais } from './tblPaises'; // Ajusta la ruta según tu estructura de proyecto
import { Departamento } from './tblDepartamentos'; // Ajusta la ruta según tu estructura de proyecto
import { Municipio } from './tblMunicipios'; // Ajusta la ruta según tu estructura de proyecto

interface PersonaAttributes {
  COD_PERSONA: number;
  ID_PERSONA: number;
  NOM_PERSONA: string;
  FK_COD_GENERO: number;
  FK_COD_PAIS: number;
  FK_COD_DEPARTAMENTO: number;
  FK_COD_MUNICIPIO: number;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface PersonaCreationAttributes extends Optional<PersonaAttributes, 'COD_PERSONA' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Persona extends Model<PersonaAttributes, PersonaCreationAttributes> implements PersonaAttributes {
  public COD_PERSONA!: number;
  public ID_PERSONA!: number;
  public NOM_PERSONA!: string;
  public FK_COD_GENERO!: number;
  public FK_COD_PAIS!: number;
  public FK_COD_DEPARTAMENTO!: number;
  public FK_COD_MUNICIPIO!: number;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Persona.init(
  {
    COD_PERSONA: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    ID_PERSONA: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    NOM_PERSONA: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    FK_COD_GENERO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Genero,
        key: 'COD_GENERO',
      },
    },
    FK_COD_PAIS: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Pais,
        key: 'COD_PAIS',
      },
    },
    FK_COD_DEPARTAMENTO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Departamento,
        key: 'COD_DEPARTAMENTO',
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
    tableName: 'TBL_PERSONAS',
    timestamps: false,
  }
);

export { Persona };
