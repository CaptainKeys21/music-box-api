import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';

export default class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  declare id: string;
  declare slug: string;
  declare title: string;
  declare content: string;
  declare imageUrl: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },

        slug: {
          type: new DataTypes.STRING(36),
          allowNull: false,
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

        title: {
          type: new DataTypes.STRING(128),
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 128],
              msg: 'Titúlo do artigo deve conter entre 3 e 128 caracteres.',
            },
          },
        },

        content: {
          type: new DataTypes.TEXT('long'),
          allowNull: true,
        },

        imageUrl: {
          type: DataTypes.STRING(128),
          allowNull: true,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Articles',
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    // this.belongsToMany(models.Profile, { through: models.ArticleProfiles });
  }
}
