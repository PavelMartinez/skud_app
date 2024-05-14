import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface EmployeeAttributes {
  id: number;
  surname: string;
  name: string;
  last_name?: string;
  photo_path?: string;
  department?: string;
  position?: string;
  foreignId?: string;
  is_entered: number;
  lastEnteredAt?: Date;
  lastLeftAt?: Date;
  is_onBreak: number;
  lastBreakAt?: Date;
  warns: number;
  lastWarnAt?: Date;
  createdByUser: number;
  is_blocked: number;
  userId: number;
}

export type EmployeePk = "id";
export type EmployeeId = Employee[EmployeePk];
export type EmployeeOptionalAttributes = "id" | "last_name" | "photo_path" | "department" | "position" | "foreignId" | "is_entered" | "lastEnteredAt" | "lastLeftAt" | "is_onBreak" | "lastBreakAt" | "warns" | "lastWarnAt" | "is_blocked";
export type EmployeeCreationAttributes = Optional<EmployeeAttributes, EmployeeOptionalAttributes>;

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  id!: number;
  surname!: string;
  name!: string;
  last_name?: string;
  photo_path?: string;
  department?: string;
  position?: string;
  foreignId?: string;
  is_entered!: number;
  lastEnteredAt?: Date;
  lastLeftAt?: Date;
  is_onBreak!: number;
  lastBreakAt?: Date;
  warns!: number;
  lastWarnAt?: Date;
  createdByUser!: number;
  is_blocked!: number;
  userId!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof Employee {
    return Employee.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      surname: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      photo_path: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      department: {
        type: DataTypes.STRING(512),
        allowNull: true
      },
      position: {
        type: DataTypes.STRING(512),
        allowNull: true
      },
      foreignId: {
        type: DataTypes.STRING(256),
        allowNull: true
      },
      is_entered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      lastEnteredAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      lastLeftAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      is_onBreak: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      lastBreakAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      warns: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lastWarnAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdByUser: {
        type: DataTypes.CHAR(36),
        allowNull: false
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: DataTypes.CHAR(36),
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'employee',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
