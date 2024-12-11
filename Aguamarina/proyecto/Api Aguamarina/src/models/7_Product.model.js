import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Product extends Model {}

Product.init({
    id_product: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(5000),
    },
    id_category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Product",
    tableName: "Products"
});

export default Product;
