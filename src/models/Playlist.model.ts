import {
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';
import Profile from './Profile.model';
import Song from './Song.model';

export default class Playlist extends Model<InferAttributes<Playlist>, InferCreationAttributes<Playlist>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getSongs: BelongsToManyGetAssociationsMixin<Song>;
  declare addSongs: BelongsToManyAddAssociationMixin<Song, string>;
  declare removeSongs: BelongsToManyRemoveAssociationMixin<Song, string>;

  declare setProfile: BelongsToSetAssociationMixin<Profile, string>;
  declare getProfile: BelongsToGetAssociationMixin<Profile>;

  static modelInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },

        name: {
          type: new DataTypes.STRING(100),
          allowNull: false,
          validate: {
            len: {
              args: [0, 100],
              msg: 'Nome da Playlist pode conter no máximo 100 caracteres',
            },
            is: {
              args: /^[\w\d À-ú]+$/i,
              msg: 'Nome da Playlist não pode conter caracteres especiais',
            },
          },
        },

        slug: {
          type: DataTypes.STRING(36),
          allowNull: false,
          unique: {
            name: 'slug',
            msg: 'Url já existe',
          },
          validate: {
            min: {
              args: [8],
              msg: 'Url deve ter no mínimo 8 caracteres',
            },
            is: {
              args: /^[a-z0-9]+$/i,
              msg: 'Url não pode ter caracteres especiais',
            },
          },
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Playlists',
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    this.belongsToMany(models.Song, { through: 'Song_Playlist' });
    this.belongsTo(models.Profile);
  }
}
