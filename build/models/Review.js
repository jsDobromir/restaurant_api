"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_1 = require("sequelize");
const DbConn_1 = require("../utils/DbConn");
const Restaurant_1 = require("./Restaurant");
const User_1 = require("./User");
class Review extends sequelize_1.Model {
}
exports.Review = Review;
;
Review.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id'
        }
    },
    restaurantId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Restaurant_1.Restaurant,
            key: 'id',
        }
    },
    rating: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize: DbConn_1.sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true
});
Review.belongsTo(Restaurant_1.Restaurant, {
    foreignKey: 'restaurantId',
    targetKey: 'id'
});
Review.belongsTo(User_1.User, {
    foreignKey: 'userId',
    targetKey: 'id'
});
