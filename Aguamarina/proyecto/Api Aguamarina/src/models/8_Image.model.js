import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

class Image extends Model {}

Image.init({
    id_image: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_product: {
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
    modelName: "Image",
    tableName: "Images"
});

export default Image;
