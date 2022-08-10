import { Options, Sequelize } from 'sequelize';
import databaseConfig from '../configs/database';
import Article from '../models/Article.model';
import Profile from '../models/Profile.model';
import History from '../models/History.model';
import User from '../models/User.model';
import Playlist from '../models/Playlist.model';
import Song from '../models/Song.model';
import Album from '../models/Album.model';

const models = [User, Profile, History, Article, Album, Song, Playlist];

const sequelize = new Sequelize(<Options>databaseConfig);

models.forEach((model) => model.modelInit(sequelize));
models.forEach((model) => model.associate && model.associate(sequelize.models));
sequelize.sync({ logging: false });

export default sequelize;
