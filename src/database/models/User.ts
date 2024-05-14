import { models } from "@auth/sequelize-adapter";
import { Model, Sequelize } from "sequelize";

interface UserAttributes extends Model {
    role: "1" | "2" | "3" | "4",
    hashedPassword: string,
    surname: string,
    lastname: string,
    gender: string
}

export default function(sequelize: Sequelize, DataTypes: any)
{
    return sequelize.define<UserAttributes>("user", {
        ...models.User,
        role: DataTypes.ENUM("1", "2", "3", "4"),
        username: DataTypes.STRING,
        hashedPassword: DataTypes.STRING,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        gender: DataTypes.ENUM("1", "2")
    })
}