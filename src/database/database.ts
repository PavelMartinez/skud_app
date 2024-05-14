import { Sequelize } from 'sequelize';
import { initModels, Employee, Guest, Log, Qr, Users } from "./models/init-models";

// import models into sequelize instance

const sequelize = new Sequelize('skud', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: require('mysql2')
})

initModels(sequelize);
// sequelize.sync()

export default {
    models: {
        Users,
        Employee,
        Guest,
        Qr,
        Log
    },
    sequelize: sequelize,
    Sequelize: Sequelize
}