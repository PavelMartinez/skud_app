import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LogAttributes {
  id: number;
  employeeId?: number;
  guestId?: number;
  action: 'createdQr' | 'enteredQr' | 'leftQr' | 'leftOnBreakQr' | 'enteredAfterBreakQr';
  issuedByUser: number;
}

export type LogPk = "id";
export type LogId = Log[LogPk];
export type LogOptionalAttributes = "id" | "employeeId" | "guestId";
export type LogCreationAttributes = Optional<LogAttributes, LogOptionalAttributes>;

export class Log extends Model<LogAttributes, LogCreationAttributes> implements LogAttributes {
  id!: number;
  employeeId?: number;
  guestId?: number;
  action!: 'createdQr' | 'enteredQr' | 'leftQr' | 'leftOnBreakQr' | 'enteredAfterBreakQr';
  issuedByUser!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof Log {
    return Log.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      guestId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      action: {
        type: DataTypes.ENUM('createdQr', 'enteredQr', 'leftQr', 'leftOnBreakQr', 'enteredAfterBreakQr'),
        allowNull: false
      },
      issuedByUser: {
        type: DataTypes.CHAR(36),
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'log',
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
