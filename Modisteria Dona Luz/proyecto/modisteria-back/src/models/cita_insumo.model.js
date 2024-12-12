const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Cita } = require('./cita.model.js');
const { Insumo } = require('./insumo.model.js');

const CitaInsumo = sequelize.define('CitaInsumo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad_utilizada: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'citas_insumos',
    timestamps: false
});

// Definir las relaciones
Cita.belongsToMany(Insumo, { through: CitaInsumo, foreignKey: 'cita_id' });
Insumo.belongsToMany(Cita, { through: CitaInsumo, foreignKey: 'insumo_id' });

module.exports = { CitaInsumo };
