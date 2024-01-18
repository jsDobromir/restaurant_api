"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const sequelize_1 = require("sequelize");
const DbConn_1 = require("../utils/DbConn");
class Restaurant extends sequelize_1.Model {
}
exports.Restaurant = Restaurant;
Restaurant.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.GEOMETRY('POINT'),
        allowNull: false
    },
    category: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true
    },
    imagePath: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize: DbConn_1.sequelize,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    timestamps: true
});
