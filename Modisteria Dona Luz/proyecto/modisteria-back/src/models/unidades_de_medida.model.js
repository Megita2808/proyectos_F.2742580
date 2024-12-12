const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Insumo } = require('./insumo.model.js');

const UnidadesDeMedida = sequelize.define('UnidadesDeMedida', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'unidades_de_medida',
    timestamps: false
});

// Definir las relaciones
UnidadesDeMedida.hasMany(Insumo, {foreignKey: 'unidadMedidaId', sourceKey: 'id', as: 'insumos'});
Insumo.belongsTo(UnidadesDeMedida, {foreignKey: 'unidadMedidaId', targetKey: 'id', as: 'unidades_de_medida'});

module.exports = { UnidadesDeMedida };
