"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    host: 'localhost',
    port: 5432,
    database: 'resturantapi',
    username: 'postgres',
    password: 'postgres',
    dialect: 'postgres',
    omitNull: true
});
exports.sequelize = sequelize;
