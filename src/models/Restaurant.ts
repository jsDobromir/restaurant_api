import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/DbConn';
import { Restaurant_Type } from '../utils/utilFunctions';

class Restaurant extends Model<InferAttributes<Restaurant>, InferCreationAttributes<Restaurant>> {

  declare id: CreationOptional<number>;
  declare name: string;
  declare category: Array<Restaurant_Type>;
  declare location: { type: 'Point'; coordinates: [number, number] };
  declare imagePath: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Restaurant.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  imagePath: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize: sequelize,
  modelName: 'Restaurant',
  tableName: 'restaurants',
  timestamps: true
});

export {Restaurant};