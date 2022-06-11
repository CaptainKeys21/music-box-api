import { Options, Sequelize } from 'sequelize';
import databaseConfig from '../configs/database' ;
import Author from '../models/Author';
import ContentManager from '../models/ContentManager';
import User from '../models/User';
// * o arquivo index da database será por onde os models realizaram a conexão com a base de dados e associações entre tabelas

const models = [User, Author, ContentManager]; // * Toda vez que um model for criado, insira no array

const sequelize = new Sequelize(<Options>databaseConfig); // * criação da conexão com sequelize, passando as configurações da base de dados em '/configs/database'

models.forEach((model) => model.modelInit(sequelize)); // * iniciando o model com a conexão do sequelize
models.forEach((model) => {model.associate && model.associate(sequelize.models);}); // * executando associações entre tableas, se o método estático associate estiver definido no model
models.forEach((model) => model.sync());
