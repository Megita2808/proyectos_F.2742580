import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class PaymentRegister extends Model {}

PaymentRegister.init({
    id_paymentregister: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_rent: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "PaymentRegister",
    tableName: "PaymentRegisters"
});

export default PaymentRegister;
