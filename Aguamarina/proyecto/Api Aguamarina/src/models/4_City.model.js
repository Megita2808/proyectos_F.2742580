import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class City extends Model {}

City.init({
    id_city: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "City",
    tableName: "Cities"
});

export default City;
