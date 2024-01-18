import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from '../utils/DbConn';
import { userRole } from '../utils/commonInterfaces';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {

  declare id: CreationOptional<number>;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare userRole: CreationOptional<userRole>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userRole: {
    type: DataTypes.ENUM,
    values: [userRole.admin, userRole.user],
    allowNull: false,
    defaultValue: userRole.user
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
  modelName: 'User',
  tableName: 'users',
  timestamps: true
});

export {User};
