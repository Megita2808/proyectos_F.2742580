const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Insumo } = require("../models/insumo.model.js")
const { Compras } = require("../models/compras.model.js")


const CompraInsumos = sequelize.define('CompraInsumos', {
    cantidad: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'compra_insumos',
    timestamps: false
});

// Definir las relaciones
Compras.belongsToMany(Insumo, { through: CompraInsumos, foreignKey: "compra_id", as: "insumos", });
Insumo.belongsToMany(Compras, { through: CompraInsumos, foreignKey: "insumo_id", as: "compras", });

module.exports = { CompraInsumos }; 
