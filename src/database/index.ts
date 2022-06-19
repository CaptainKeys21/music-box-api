import { Options, Sequelize } from 'sequelize';
import databaseConfig from '../configs/database';
import Article from '../models/Article.model';
import Author from '../models/Author.model';
import ContentManager from '../models/ContentManager.model';
import History from '../models/History.model';
import User from '../models/User.model';

const models = [User, Author, ContentManager, History, Article];

export const sequelize = new Sequelize(<Options>databaseConfig);

models.forEach((model) => model.modelInit(sequelize));
models.forEach((model) => model.associate && model.associate(sequelize.models));
models.forEach((model) => model.sync());

console.log('test');
