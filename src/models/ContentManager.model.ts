import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from 'sequelize';


export default class ContentManager extends Model<InferAttributes<ContentManager>, InferCreationAttributes<ContentManager>> {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize) {
    this.init({
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },{
      tableName: 'ContentManager',
      sequelize
    });
  }

  static associate(models: {[key: string]: ModelStatic<Model>;}): void {
    this.belongsTo(models.Author, {onDelete: 'CASCADE'});
    this.belongsTo(models.History, {onDelete: 'CASCADE'});
    this.belongsTo(models.Article, {onDelete: 'CASCADE'});
  }
}
