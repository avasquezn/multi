import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Persona } from './tblPersonas'; // Ajusta la ruta según tu estructura de proyecto

interface ClienteAttributes {
  COD_CLIENTE: number;
  FK_COD_PERSONA: number;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICACION?: Date;
}

interface ClienteCreationAttributes extends Optional<ClienteAttributes, 'COD_CLIENTE' | 'USR_MODIFICO' | 'FEC_MODIFICACION'> {}

class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
  public COD_CLIENTE!: number;
  public FK_COD_PERSONA!: number;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICACION?: Date;
}

Cliente.init(
  {
    COD_CLIENTE: {
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
  },
  {
    sequelize,
    tableName: 'TBL_OP_CLIENTES',
    timestamps: false,
  }
);

export { Cliente };
