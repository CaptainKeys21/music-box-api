import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from 'sequelize/types';

export default class Author extends Model<InferAttributes<Author>, InferCreationAttributes<Author>> {
  declare id: string;
  declare slug: string;
  declare authorName: string;
  declare local: string;
  declare website: string;
  declare bio: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true
      },
      slug: {
        type: new DataTypes.CHAR(36),
        allowNull: false,
        unique:{
          name: 'slug',
          msg: 'Url já existe'
        },
        validate: {
          min: {
            args: [8],
            msg: 'Url deve ter no mínimo 8 caracteres',
          },
          is: {
            args: /^[a-z0-9]+$/i,
            msg: 'Url não pode ter caracteres especiais',
          }
        }
      },
      authorName: {
        type: new DataTypes.CHAR(100),
        allowNull: true,
      },
      local: {
        type: new DataTypes.CHAR(100),
        allowNull: true,
      },
      website: {
        type: new DataTypes.CHAR(100),
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'URL inválida'
          }
        }
      },
      bio: {
        type: new DataTypes.CHAR(1024),
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },{
      tableName: 'Author',
      sequelize
    });
  }

  static associate(models: {[key: string]: ModelStatic<Model>;}): void {
    this.belongsTo(models.User, {
      foreignKey: {
        name: 'fkUserId',
        allowNull: false
      }
    });

    this.hasMany(models.ContentManager, {foreignKey: 'fkAuthorId'});
  }
}
