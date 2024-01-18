import {Sequelize} from 'sequelize';

const sequelize = new Sequelize({
  host: 'localhost',
  port: 5432,
  database: 'resturantapi',
  username: 'postgres',
  password: 'postgres',
  dialect: 'postgres',
  omitNull: true
});

export {sequelize};