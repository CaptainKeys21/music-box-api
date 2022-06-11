import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from 'sequelize/types';

export default class History extends Model<InferAttributes<History>, InferCreationAttributes<History>> {
  declare id: string;
  declare target: string;
  declare action: string;

  declare createdAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize): void {
    this.init({
      id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      action: {
        type: new DataTypes.STRING(48),
        allowNull: false,
      },
      target: {
        type: new DataTypes.STRING(48),
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
    },{
      tableName: 'History',
      sequelize
    });
  }

  static associate(models: {[key: string]: ModelStatic<Model>;}) {
    this.hasMany(models.ContentManager, {foreignKey: 'fkHistoryId'});
  }
}
