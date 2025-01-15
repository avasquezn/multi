import { Sequelize } from 'sequelize';

// Configuración de Sequelize para la base de datos
const sequelize = new Sequelize(process.env.DATABASE || '', process.env.USER || '', process.env.PASSWORD || '', {
  host: process.env.HOST,
  dialect: process.env.DIALECT as any, // Tipado para Dialect (string no compatible por defecto)
  port: Number(process.env.PORT_DB) || 3306,
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

export default sequelize;
