import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';

export default class Playlist extends Model<InferAttributes<Playlist>, InferCreationAttributes<Playlist>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

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
