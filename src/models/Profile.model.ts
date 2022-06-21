import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';

export default class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  declare id: string;
  declare slug: string;
  declare profileName: string;
  declare local: string;
  declare website: string;
  declare bio: string;
  declare imageUrl: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
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
          defaultValue: '',
          validate: {
            len: {
              args: [3, 100],
              msg: 'Nome de perfil deve conter entre 3 e 100 caracteres',
            },
            is: {
              args: /^[\w\d áàâãéèêíïóôõöúçñ]+$/i,
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
              msg: 'URL inválida',
            },
          },
        },

        bio: {
          type: new DataTypes.STRING(1024),
          allowNull: true,
        },

        imageUrl: {
          type: DataTypes.STRING,
          defaultValue: '', //TODO: aqui vai vir o caminho/url da foto de perfil padrão de todos os usuários.
          allowNull: false,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Profiles',
        freezeTableName: true,
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }): void {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.hasMany(models.Article);
    this.hasMany(models.History);
  }
}
