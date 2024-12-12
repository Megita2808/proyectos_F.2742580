const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection.js");
const { Catalogo } = require("./catalogo.model.js");
const { Pedido } = require("./pedido.model.js");

const Talla = sequelize.define(
  "Talla",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("Numérica", "Alfanumérica"),
    },
  },
  {
    timestamps: false,
  }
);

Catalogo.belongsToMany(Talla, { through: "CatalogoTalla" });
Talla.belongsToMany(Catalogo, { through: "CatalogoTalla" });

Pedido.belongsTo(Talla, { foreignKey: "tallaId" });
Talla.hasMany(Pedido, { foreignKey: "tallaId" });

module.exports = { Talla };
