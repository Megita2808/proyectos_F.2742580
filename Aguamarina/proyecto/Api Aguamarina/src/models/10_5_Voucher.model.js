import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Voucher extends Model {}

Voucher.init({
    id_image: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_reservation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    path_image: {
        type: DataTypes.STRING,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Voucher",
    tableName: "Vouchers"
});

export default Voucher;
