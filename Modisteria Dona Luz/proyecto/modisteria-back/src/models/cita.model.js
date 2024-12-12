const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Venta } = require('../models/venta.model.js')

const Cita = sequelize.define('Cita',
  {
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    referencia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    objetivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tiempo: {
      type: DataTypes.TIME,
      allowNull: true
    },
    estadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = { Cita };

Cita.hasOne(Venta, { foreignKey: 'citaId', as: 'venta' });
Venta.belongsTo(Cita, { foreignKey: 'citaId', as: 'cita' });
