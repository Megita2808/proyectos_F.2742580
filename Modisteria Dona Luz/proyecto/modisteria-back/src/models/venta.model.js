const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');

const Venta = sequelize.define('Venta', {
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nombrePersona: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    valorDomicilio: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    valorPrendas: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    valorFinal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    metodoPago: {
        type: DataTypes.ENUM('transferencia'),
        allowNull: false,
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    citaId:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
}, {
    timestamps: false,
});


module.exports = { Venta };
