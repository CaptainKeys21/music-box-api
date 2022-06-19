import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';

import { compareSync, hash } from 'bcrypt';

// * Model para a tabela User, ela é inicializada com a classe estática modelInit na /database/index.tsx assim como o método estático associate se ele estiver definido

// ! Cuidado ao criar novos models, a tipagem deles tem que ser bem definida, já que é uma abstração de alto nível da base de dados.

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare password: string;
  declare lastLogin: Date;

  // * Por padrão, todas as tabelas terão esses dois campos
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },

        username: {
          type: new DataTypes.CHAR(100),
          allowNull: false,
          unique: {
            name: 'username',
            msg: 'Nome de usuário já existe',
          },
        },

        email: {
          type: new DataTypes.CHAR(100),
          allowNull: false,
          unique: 'E-mail já existe',
          validate: {
            isEmail: {
              msg: 'E-mail inválido',
            },
          },
        },

        password_hash: {
          type: new DataTypes.CHAR(100),
        },

        password: {
          type: DataTypes.VIRTUAL, // * uma coluna com o tipo virtual só existe no model, ela é util para caso queira ralizar um tratamento especial antes de lançar na base de dados
          allowNull: false,
          validate: {
            min: {
              args: [6],
              msg: 'Senha deve possuir no mínimo 6 caracteres',
            },
          },
        },

        lastLogin: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Users',
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user: User): Promise<void> => {
      if (user.password) {
        user.password_hash = await hash(user.password, 8);
      }
    });
  }

  static associate(models: { [key: string]: ModelStatic<Model> }): void {
    this.hasOne(models.Author, { onDelete: 'CASCADE' });
  }

  passwordIsValid(password: string): boolean {
    return compareSync(password, this.password_hash);
  }
}
