import type { Sequelize } from "sequelize";
import { Employee as _Employee } from "./Employee";
import type { EmployeeAttributes, EmployeeCreationAttributes } from "./Employee";
import { Guest as _Guest } from "./Guest";
import type { GuestAttributes, GuestCreationAttributes } from "./Guest";
import { Log as _Log } from "./Log";
import type { LogAttributes, LogCreationAttributes } from "./Log";
import { Qr as _Qr } from "./Qr";
import type { QrAttributes, QrCreationAttributes } from "./Qr";
import { Users as _Users } from "./Users";
import type { UsersAttributes, UsersCreationAttributes } from "./Users";

export {
  _Employee as Employee,
  _Guest as Guest,
  _Log as Log,
  _Qr as Qr,
  _Users as Users,
};

export type {
  EmployeeAttributes,
  EmployeeCreationAttributes,
  GuestAttributes,
  GuestCreationAttributes,
  LogAttributes,
  LogCreationAttributes,
  QrAttributes,
  QrCreationAttributes,
  UsersAttributes,
  UsersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Employee = _Employee.initModel(sequelize);
  const Guest = _Guest.initModel(sequelize);
  const Log = _Log.initModel(sequelize);
  const Qr = _Qr.initModel(sequelize);
  const Users = _Users.initModel(sequelize);

  Employee.hasMany(Log, { foreignKey: 'employeeId', as: "Logs" });
  Guest.hasMany(Log, { foreignKey: 'guestId', as: "Logs" });
  Log.belongsTo(Employee, { foreignKey: 'employeeId', as: "IdLogEmployee" });
  Log.belongsTo(Guest, { foreignKey: 'guestId', as: "IdGueGuest" });

  Employee.hasMany(Qr, { foreignKey: 'employeeId', as: "Qrs" });
  Guest.hasMany(Qr, { foreignKey: 'guestId', as: "Qrs" });
  Qr.belongsTo(Employee, { foreignKey: 'employeeId', as: "IdQrEmployee" });
  Qr.belongsTo(Guest, { foreignKey: 'guestId', as: "IdQrGuest" });

  Users.hasOne(Employee, {
    foreignKey: 'userId', // ключ в таблице Employee, ссылающийся на Users
    as: 'employee' // псевдоним для доступа из Users к Employee
  });

  Employee.belongsTo(Users, {
    foreignKey: 'userId', // ключ в таблице Employee, ссылающийся на Users
    as: 'user' // псевдоним для доступа из Employee к Users
  });

  Users.hasOne(Guest, {
    foreignKey: 'userId', // ключ в таблице Guest, ссылающийся на Users
    as: 'guest' // псевдоним для доступа из Users к Guest
  });

  Guest.belongsTo(Users, {
    foreignKey: 'userId', // ключ в таблице Guest, ссылающийся на Users
    as: 'user' // псевдоним для доступа из Guest к Users
  });

  return {
    Employee: Employee,
    Guest: Guest,
    Log: Log,
    Qr: Qr,
    Users: Users,
  };
}
