import { BelongsToManyAddAssociationsMixin, BelongsToManyGetAssociationsMixin } from 'sequelize';
import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import Profile from './Profile.model';

export default class Article extends Model<
  InferAttributes<Article, { omit: 'profiles' }>,
  InferCreationAttributes<Article, { omit: 'profiles' }>
> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare title: string;
  declare content: string;
  declare imageUrl: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare profiles?: NonAttribute<Profile[]>;

  declare addProfiles: BelongsToManyAddAssociationsMixin<Profile, string>;
  declare getProfiles: BelongsToManyGetAssociationsMixin<Profile>;

  declare static associations: {
    profiles: Association<Article, Profile>;
  };

  declare static profiles: Profile;

  static modelInit(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
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
              args: /^[a-z0-9-]+$/i,
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
          type: new DataTypes.TEXT(),
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
    this.belongsToMany(models.Profile, { through: 'Article_Profile' });
  }
}
