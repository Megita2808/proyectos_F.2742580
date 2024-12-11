import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Rol extends Model {}

Rol.init({
    id_rol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Rol",
    tableName: "Roles"
    });

export default Rol;
