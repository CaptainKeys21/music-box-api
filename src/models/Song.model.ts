import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';
import Album from './Album.model';
import Genre from './Genre.model';
import Profile from './Profile.model';

export default class Song extends Model<InferAttributes<Song>, InferCreationAttributes<Song>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare filename: string;
  declare slug: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare setProfiles: BelongsToManySetAssociationsMixin<Profile, string>;
  declare getProfiles: BelongsToManyGetAssociationsMixin<Profile>;
  declare getGenres: BelongsToManyGetAssociationsMixin<Genre>;
  declare setGenres: BelongsToManySetAssociationsMixin<Genre, string>;

  declare getAlbum: BelongsToGetAssociationMixin<Album>;
  declare setAlbum: BelongsToSetAssociationMixin<Album, string>;
  declare createAlbum: BelongsToCreateAssociationMixin<Album>; //* esse método será utilizado caso a música não seja adicionada em nenhum álbum

  static modelInit(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        name: {
          type: new DataTypes.STRING(100),
          allowNull: false,
          validate: {
            len: {
              args: [0, 100],
              msg: 'Nome da Música pode conter no máximo 100 caracteres',
            },
            is: {
              args: /^[\w\d À-ú]+$/i,
              msg: 'Nome da Música não pode conter caracteres especiais',
            },
          },
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

        filename: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            name: 'filename',
            msg: 'arquivo já existente',
          },
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Songs',
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    this.belongsToMany(models.Playlist, { through: 'Song_Playlist' });
    this.belongsToMany(models.Profile, { through: 'Song_Profile' });
    this.belongsToMany(models.Genre, { through: 'Song_Genre' });
    this.belongsTo(models.Album);
  }
}
