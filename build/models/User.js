"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const DbConn_1 = require("../utils/DbConn");
const commonInterfaces_1 = require("../utils/commonInterfaces");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    userRole: {
        type: sequelize_1.DataTypes.ENUM,
        values: [commonInterfaces_1.userRole.admin, commonInterfaces_1.userRole.user],
        allowNull: false,
        defaultValue: commonInterfaces_1.userRole.user
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});
