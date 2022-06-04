import { Options } from 'sequelize/types';

// * configurações da base de dados;
// TODO: posteriormente, inserir esses dados em um .env
const databaseConfig: Options = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'usuario',
  password: 'senha',
  database: 'base_de_dados',
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

export default databaseConfig;
