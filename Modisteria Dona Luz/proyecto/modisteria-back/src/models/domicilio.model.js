const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/connection.js");
const { Venta } = require("./venta.model.js");

const Domicilio = sequelize.define(
  "Domicilio",
  {
    numeroGuia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tarifa: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ventaId: {
      type: DataTypes.INTEGER,
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

//Relacion domicilio y venta
Venta.hasMany(Domicilio, { foreignKey: "ventaId", as: "domicilio" });
Domicilio.belongsTo(Venta, { foreignKey: "ventaId", as: "ventas" });

module.exports = { Domicilio };
