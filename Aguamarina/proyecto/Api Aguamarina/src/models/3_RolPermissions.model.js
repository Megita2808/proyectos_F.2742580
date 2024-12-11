import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class RolPermissions extends Model {}

RolPermissions.init({
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_permission: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    sequelize,
    tableName: 'RolPermissions',
    timestamps: true 
});

export default RolPermissions;
