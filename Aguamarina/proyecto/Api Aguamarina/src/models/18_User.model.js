import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class User extends Model {}

User.init({
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    names: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastnames: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false
        //defaultValue: 2
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "User",
    tableName: "Users"
});

export default User;
