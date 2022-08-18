import {
  BelongsToManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Op,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';
import Album from './Album.model';
import Article from './Article.model';
import Playlist from './Playlist.model';
import Song from './Song.model';
import User from './User.model';

export default class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare profileName: CreationOptional<string>;
  declare local: CreationOptional<string | null>;
  declare website: CreationOptional<string | null>;
  declare bio: CreationOptional<string | null>;
  declare imageUrl: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getUser: BelongsToGetAssociationMixin<User>;
  declare getSongs: BelongsToManyGetAssociationsMixin<Song>;
  declare getAlbuns: BelongsToManyGetAssociationsMixin<Album>;
  declare getArticles: BelongsToManyGetAssociationsMixin<Article>;

  declare createPlaylist: HasManyCreateAssociationMixin<Playlist>;
  declare getPlaylists: HasManyGetAssociationsMixin<Playlist>;

  static modelInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        slug: {
          type: new DataTypes.STRING(36),
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

        profileName: {
          type: new DataTypes.STRING(100),
          allowNull: false,
          validate: {
            len: {
              args: [0, 100],
              msg: 'Nome de perfil pode conter no máximo 100 caracteres',
            },
            is: {
              args: /^[\w\d À-ú]+$/i,
              msg: 'Nome de perfil não pode conter caracteres especiais',
            },
          },
        },

        local: {
          type: new DataTypes.STRING(255),
          allowNull: true,
        },

        website: {
          type: new DataTypes.STRING(255),
          allowNull: true,
          validate: {
            isUrl: {
              msg: 'URL de Website inválida',
            },
          },
        },

        bio: {
          type: new DataTypes.STRING(1024),
          allowNull: true,
        },

        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Profiles',
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }): void {
    this.belongsTo(models.User);
    this.belongsToMany(models.Article, { through: 'Article_Profile' });
    this.belongsToMany(models.Song, { through: 'Song_Profile' });
    this.belongsToMany(models.Album, { through: 'Album_Profile' });
    this.hasMany(models.Playlist, { onDelete: 'CASCADE' });
  }

  static async findBySession(user: { email: string; username: string }): Promise<Profile | null> {
    const profile = await this.findOne({
      include: { model: User, where: { [Op.or]: [{ email: user.email }, { username: user.username }] } },
    });

    return profile;
  }

  //* Função para checar se o usuário é o dono desse perfil
  async isAuthorized(searchParam: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: searchParam }, { username: searchParam }],
      },
    });

    if (!user) return false;
    if (user.id !== (await this.getUser()).id) return false;

    return true;
  }
}
