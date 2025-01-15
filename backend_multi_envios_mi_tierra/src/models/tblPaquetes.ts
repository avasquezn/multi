import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database/index'; // Ajusta la ruta según tu estructura de proyecto
import { Caja } from './tblCaja'; // Ajusta la ruta según tu estructura de proyecto
import { Estado } from './tblEstados'; // Ajusta la ruta según tu estructura de proyecto
import { Cliente } from './tblOpClientes'; // Ajusta la ruta según tu estructura de proyecto
import { DatosEnvio } from './tblDatosEnvios'; // Ajusta la ruta según tu estructura de proyecto

interface PaqueteAttributes {
  COD_PAQUETE: number;
  FK_COD_CAJA: number;
  FK_COD_ESTADO: number;
  FK_COD_CLIENTE: number;
  FK_COD_ENVIO: number;
  FEC_ENTREGA?: Date;
  USR_CREO: string;
  FEC_CREACION: Date;
  USR_MODIFICO?: string;
  FEC_MODIFICO?: Date;
}

interface PaqueteCreationAttributes extends Optional<PaqueteAttributes, 'COD_PAQUETE' | 'FEC_ENTREGA' | 'USR_MODIFICO' | 'FEC_MODIFICO'> {}

class Paquete extends Model<PaqueteAttributes, PaqueteCreationAttributes> implements PaqueteAttributes {
  public COD_PAQUETE!: number;
  public FK_COD_CAJA!: number;
  public FK_COD_ESTADO!: number;
  public FK_COD_CLIENTE!: number;
  public FK_COD_ENVIO!: number;
  public FEC_ENTREGA?: Date;
  public USR_CREO!: string;
  public FEC_CREACION!: Date;
  public USR_MODIFICO?: string;
  public FEC_MODIFICO?: Date;
}

Paquete.init(
  {
    COD_PAQUETE: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FK_COD_CAJA: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Caja,
        key: 'COD_CAJA',
      },
    },
    FK_COD_ESTADO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Estado,
        key: 'COD_ESTADO',
      },
    },
    FK_COD_CLIENTE: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Cliente,
        key: 'COD_CLIENTE',
      },
    },
    FK_COD_ENVIO: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: DatosEnvio,
        key: 'COD_ENVIO',
      },
    },
    FEC_ENTREGA: {
      type: DataTypes.DATE,
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
    tableName: 'TBL_PAQUETE',
    timestamps: false,
  }
);

export { Paquete };
