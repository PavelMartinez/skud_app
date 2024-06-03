import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface QrAttributes {
  id: number;
  employeeId?: number;
  guestId?: number;
  type: 'enterleave' | 'break';
  secret_key: string;
  is_expired: number;
  expiredAt?: Date;
}

export type QrPk = "id";
export type QrId = Qr[QrPk];
export type QrOptionalAttributes = "id" | "employeeId" | "guestId" | "is_expired" | "expiredAt";
export type QrCreationAttributes = Optional<QrAttributes, QrOptionalAttributes>;

export class Qr extends Model<QrAttributes, QrCreationAttributes> implements QrAttributes {
  [x: string]: any;
  id!: number;
  employeeId?: number;
  guestId?: number;
  type!: 'enterleave' | 'break';
  secret_key!: string;
  is_expired!: number;
  expiredAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Qr {
    return Qr.init({
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
      type: {
        type: DataTypes.ENUM('enterleave', 'break'),
        allowNull: false
      },
      secret_key: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      is_expired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
    sequelize,
    tableName: 'qr',
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
