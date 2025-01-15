import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Cliente } from './tblOpClientes'; // Ajusta la ruta según tu estructura de proyecto
import { Pais } from './tblPaises'; // Ajusta la ruta según tu estructura de proyecto
import { Departamento } from './tblDepartamentos'; // Ajusta la ruta según tu estructura de proyecto
import { Municipio } from './tblMunicipios'; // Ajusta la ruta según tu estructura de proyecto
import { Direccion } from './tblDirecciones'; // Ajusta la ruta según tu estructura de proyecto
import { Persona } from './tblPersonas'; // Ajusta la ruta según tu estructura de proyecto

interface DatosEnvioAttributes {
  COD_ENVIO: number;
  FK_COD_CLIENTE: number;
  CANTIDAD_CAJAS: number;
  FK_COD_PAIS_ORIGEN: number;
  FK_COD_PAIS_DESTINO: number;
  FK_COD_DEPARTAMENTO: number;
  FK_COD_MUNICIPIO: number;
  FK_COD_DIRECCION: number;
  FK_COD_PERSONA: number;
  NUM_ENVIO?: string;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface DatosEnvioCreationAttributes extends Optional<DatosEnvioAttributes, 'COD_ENVIO' | 'NUM_ENVIO' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class DatosEnvio extends Model<DatosEnvioAttributes, DatosEnvioCreationAttributes> implements DatosEnvioAttributes {
  public COD_ENVIO!: number;
  public FK_COD_CLIENTE!: number;
  public CANTIDAD_CAJAS!: number;
  public FK_COD_PAIS_ORIGEN!: number;
  public FK_COD_PAIS_DESTINO!: number;
  public FK_COD_DEPARTAMENTO!: number;
  public FK_COD_MUNICIPIO!: number;
  public FK_COD_DIRECCION!: number;
  public FK_COD_PERSONA!: number;
  public NUM_ENVIO?: string;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

DatosEnvio.init(
  {
    COD_ENVIO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_CLIENTE: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Cliente,
        key: 'COD_CLIENTE',
      },
    },
    CANTIDAD_CAJAS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FK_COD_PAIS_ORIGEN: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Pais,
        key: 'COD_PAIS',
      },
    },
    FK_COD_PAIS_DESTINO: {
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
    FK_COD_DIRECCION: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Direccion,
        key: 'COD_DIRECCION',
      },
    },
    FK_COD_PERSONA: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Persona,
        key: 'COD_PERSONA',
      },
    },
    NUM_ENVIO: {
      type: DataTypes.STRING(50),
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
    tableName: 'TBL_DATOS_ENVIO',
    timestamps: false,
  }
);

export { DatosEnvio };
