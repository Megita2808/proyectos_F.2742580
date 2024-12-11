import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class ReservationDetail extends Model {}

ReservationDetail.init({
    id_reservation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unit_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "ReservationDetail",
    tableName: "ReservationDetails"
});

export default ReservationDetail;
