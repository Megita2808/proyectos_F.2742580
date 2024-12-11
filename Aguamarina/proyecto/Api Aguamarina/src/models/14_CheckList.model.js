import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class CheckList extends Model {}

CheckList.init({
    id_checklist: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_rent: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "CheckList",
    tableName: "CheckLists"
});

export default CheckList;
