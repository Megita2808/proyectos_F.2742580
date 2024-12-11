import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class VerificationCode extends Model {}

VerificationCode.init({
    mail: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: false,
    modelName: "VerificationCode",
    tableName: "VerificationCodes"
});

export default VerificationCode;
