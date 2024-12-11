import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Loss extends Model {}

Loss.init({
    id_loss: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    loss_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    observations: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Loss",
    tableName: "Losses"
});

export default Loss;
