import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';

export default class Genre extends Model<InferAttributes<Genre>, InferCreationAttributes<Genre>> {
  declare id: CreationOptional<string>;
  declare name: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },

        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Genres',
        sequelize,
      },
    );
  }

  static associate(models: { [key: string]: ModelStatic<Model> }) {
    this.belongsToMany(models.Song, { through: 'Song_Genre' });
  }

  static async getGenresByNames(genresNames: string[]) {
    const errors: Error[] = [];

    const genresArray: Genre[] = [];
    for (const genreName of genresNames) {
      const genre = await Genre.findOne({ where: { name: genreName } });
      if (!genre) errors.push(new Error(`Gênero '${genreName}' inexistente!`));
      else genresArray.push(genre);
    }

    if (errors.length > 0) throw errors.map((error) => error.message);
    return genresArray;
  }
}
