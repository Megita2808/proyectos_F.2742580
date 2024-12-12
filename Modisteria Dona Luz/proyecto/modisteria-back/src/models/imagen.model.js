const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection.js");
const { Catalogo } = require("./catalogo.model.js");

const Imagen = sequelize.define("Imagen", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  catalogoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Catalogo,
      key: "id",
    },
  },
}, {
    tableName: 'Imagenes',
    timestamps: false,
});

Catalogo.hasMany(Imagen, { foreignKey: "catalogoId" });
Imagen.belongsTo(Catalogo, { foreignKey: "catalogoId" });

module.exports = { Imagen };
