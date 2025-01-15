import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Rol } from './tblMsRoles'; // Ajusta la ruta según tu estructura de proyecto
import { Persona } from './tblPersonas'; // Ajusta la ruta según tu estructura de proyecto

interface UsuarioAttributes {
  COD_USUARIO: number;
  FK_COD_ROL: number;
  FK_COD_PERSONA: number;
  NOM_USUARIO: string;
  CONTRASENA: string;
  TOKEN: String;
  FEC_ULTIMA_CONEXION: Date;
  FEC_VENCIMIENTO: Date;
  NUM_INTENTOS: number;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICACION?: Date;
  ESTADO: boolean;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'COD_USUARIO' | 'USR_MODIFICO' | 'FEC_MODIFICACION'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public COD_USUARIO!: number;
  public FK_COD_ROL!: number;
  public FK_COD_PERSONA!: number;
  public NOM_USUARIO!: string;
  public CONTRASENA!: string;
  public TOKEN!: string;
  public FEC_ULTIMA_CONEXION!: Date;
  public FEC_VENCIMIENTO!: Date;
  public NUM_INTENTOS!: number;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICACION?: Date;
  public ESTADO!: boolean;
}

Usuario.init(
  {
    COD_USUARIO: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_ROL: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Rol,
        key: 'COD_ROL',
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
    NOM_USUARIO: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    CONTRASENA: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    TOKEN: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    FEC_ULTIMA_CONEXION: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    FEC_VENCIMIENTO: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    NUM_INTENTOS: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    FEC_MODIFICACION: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ESTADO: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'TBL_MS_USUARIOS',
    timestamps: false,
  }
);

export { Usuario };
