import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class LossDetail extends Model {}

LossDetail.init({
    id_loss: {
        type: DataTypes.INTEGER,
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    }, {
    sequelize,
    timestamps: true,
    modelName: "LossDetail",
    tableName: "LossDetails"
});

export default LossDetail;
