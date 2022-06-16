/* eslint-disable @typescript-eslint/no-var-requires */
// * configurações da base de dados;
require('dotenv').config();

const databaseConfig = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptions: {
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',
};

module.exports = databaseConfig;
