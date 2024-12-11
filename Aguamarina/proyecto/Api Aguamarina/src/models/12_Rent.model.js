import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Rent extends Model {}

Rent.init({
    id_rent: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_reservation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_seller: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_client: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    payment: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Rent",
    tableName: "Rents"
});

export default Rent;
