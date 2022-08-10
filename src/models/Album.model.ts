import {
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';
import Profile from './Profile.model';
import Song from './Song.model';

export default class Album extends Model<InferAttributes<Album>, InferCreationAttributes<Album>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare coverImg: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getSongs: HasManyGetAssociationsMixin<Song>;
  declare addSongs: HasManyAddAssociationMixin<Song, string>;
  declare removeSongs: HasManyRemoveAssociationMixin<Song, string>;

  declare setProfiles: BelongsToManySetAssociationsMixin<Profile, string>;
  declare getProfiles: BelongsToManyGetAssociationsMixin<Profile>;

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
              msg: 'Nome da Album pode conter no máximo 100 caracteres',
            },
            is: {
              args: /^[\w\d À-ú]+$/i,
              msg: 'Nome da Album não pode conter caracteres especiais',
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

        coverImg: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Albuns',
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    this.belongsToMany(models.Profile, { through: 'Album_Profile' });
    this.hasMany(models.Song);
  }
}
