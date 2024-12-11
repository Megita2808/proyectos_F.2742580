import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class CheckListItem extends Model {}

CheckListItem.init({
    id_checklistitem: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_checklist: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name_product: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bad_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "CheckListItem",
    tableName: "CheckListItems"
});

export default CheckListItem;
