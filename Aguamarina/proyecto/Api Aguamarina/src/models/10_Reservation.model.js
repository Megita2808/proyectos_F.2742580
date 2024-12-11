import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Reservation extends Model {}

Reservation.init({
    id_reservation: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: { //Cambiar por id_city
        type: DataTypes.STRING,
        allowNull: false
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtotal_reservations: {
        type: DataTypes.DECIMAL,
    },
    shipping_cost: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    type_shipping: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deposit: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    total_reservation: {
        type: DataTypes.DECIMAL,
    },
    type_payment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cancel_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "En Espera"
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Reservation",
    tableName: "Reservations"
});

export default Reservation;