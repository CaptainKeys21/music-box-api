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
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password_hash: CreationOptional<string>;
  declare password: string;
  declare lastLogin: CreationOptional<Date>;

  // * Por padrão, todas as tabelas terão esses dois campos
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  static modelInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        username: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          validate: {
            len: {
              args: [3, 50],
              msg: 'Nome de usuário deve conter entre 3 e 50 caracteres.',
            },
            is: {
              args: /^[a-z0-9_]+$/i,
              msg: 'Nome de usuário não pode conter espaços, acentos e caracteres especiais ',
            },
          },
          unique: {
            name: 'username',
            msg: 'Nome de usuário já existe',
          },
        },

        email: {
          type: DataTypes.STRING,
          defaultValue: '',
          allowNull: false,
          unique: {
            name: 'email',
            msg: 'Este email já foi registrado',
          },
          validate: {
            isEmail: {
              msg: 'E-mail inválido',
            },
          },
        },

        password_hash: {
          type: DataTypes.STRING,
        },

        password: {
          type: DataTypes.VIRTUAL, // * uma coluna com o tipo virtual só existe no model, ela é util para caso queira ralizar um tratamento especial antes de lançar na base de dados
          allowNull: false,
          defaultValue: '',
          validate: {
            len: {
              args: [6, 100],
              msg: 'Senha deve possuir entre 6 e 100 caracteres',
            },
          },
        },

        lastLogin: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
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
    this.hasOne(models.Profile, { onDelete: 'CASCADE' });
  }

  passwordIsValid(password: string): boolean {
    return compareSync(password, this.password_hash);
  }
}
