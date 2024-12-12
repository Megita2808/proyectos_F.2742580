const { DataTypes } = require("sequelize");
const { Compras } = require("../models/compras.model.js");

const { sequelize } = require("../database/connection.js");
const { Insumo } = require("./insumo.model.js");

const Proveedor = sequelize.define(
  "Proveedor",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Proveedor };

// Relación de compras a proveedor
Proveedor.hasMany(Compras, { foreignKey: "proveedorId", as: "compras" });
Compras.belongsTo(Proveedor, { foreignKey: "proveedorId", as: "proveedor" });
