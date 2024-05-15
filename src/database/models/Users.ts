import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UsersAttributes {
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  role?: '1' | '2' | '3' | '4';
  username?: string;
  hashedPassword?: string;
  surname?: string;
  lastname?: string;
  gender?: '1' | '2';
}

export type UsersPk = "id";
export type UsersId = Users[UsersPk];
export type UsersOptionalAttributes = "name" | "email" | "emailVerified" | "image" | "role" | "username" | "hashedPassword" | "surname" | "lastname" | "gender";
export type UsersCreationAttributes = Optional<UsersAttributes, UsersOptionalAttributes>;

export class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  role?: '1' | '2' | '3' | '4';
  username?: string;
  hashedPassword?: string;
  surname?: string;
  lastname?: string;
  gender?: '1' | '2';


  static initModel(sequelize: Sequelize.Sequelize): typeof Users {
    return Users.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: "email"
      },
      emailVerified: {
        type: DataTypes.DATE,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM('1', '2', '3', '4'),
        allowNull: true
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      hashedPassword: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      surname: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      lastname: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('1', '2'),
        allowNull: true
      }
    }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
