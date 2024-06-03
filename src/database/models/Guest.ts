import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface GuestAttributes {
  id: number;
  surname: string;
  name: string;
  last_name?: string;
  photo_path?: string;
  document_number?: number;
  visit_purpose?: string;
  foreignId?: string;
  is_entered: number;
  lastEnteredAt?: Date;
  lastLeftAt?: Date;
  createdByUser: number;
  is_blocked: number;
  expiredAt?: Date;
  userId: number;
}

export type GuestPk = "id";
export type GuestId = Guest[GuestPk];
export type GuestOptionalAttributes = "id" | "photo_path" | "document_number" | "visit_purpose" | "foreignId" | "is_entered" | "lastEnteredAt" | "lastLeftAt" | "is_blocked" | "expiredAt";
export type GuestCreationAttributes = Optional<GuestAttributes, GuestOptionalAttributes>;

export class Guest extends Model<GuestAttributes, GuestCreationAttributes> implements GuestAttributes {
  id!: number;
  surname!: string;
  name!: string;
  last_name?: string;
  photo_path?: string;
  document_number?: number;
  visit_purpose?: string;
  foreignId?: string;
  is_entered!: number;
  lastEnteredAt?: Date;
  lastLeftAt?: Date;
  createdByUser!: number;
  is_blocked!: number;
  expiredAt?: Date;
  userId!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof Guest {
    return Guest.init({
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
      document_number: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      visit_purpose: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      foreignId: {
        type: DataTypes.STRING(255),
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
      createdByUser: {
        type: DataTypes.CHAR(36),
        allowNull: false
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    }, {
    sequelize,
    tableName: 'guest',
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
