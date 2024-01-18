import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/DbConn';
import { Restaurant } from './Restaurant';
import { User } from './User';

class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare restaurantId: number;
  declare rating: number;
  declare comment: CreationOptional<string>;
};

Review.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  restaurantId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Restaurant,
      key: 'id',
    }
  },
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }, 
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize: sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  timestamps: true
});

Review.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  targetKey: 'id'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'id'
});


export {Review};