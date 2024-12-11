import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Category extends Model {}

Category.init({
    id_category: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
    }, {
    sequelize,
    timestamps: true,
    modelName: "Category",
    tableName: "Categories"
});

export default Category;
