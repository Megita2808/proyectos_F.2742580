const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Venta } = require('./venta.model.js');
const { Catalogo } = require('./catalogo.model.js');

const Pedido = sequelize.define('Pedido',
  {
    idPedido: {
      type: DataTypes.UUID,
      allowNull: false,
      autoIncrement: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valorUnitario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tallaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catalogoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estadoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
  },
);

Pedido.belongsTo(Catalogo, { foreignKey: 'catalogoId', as: 'catalogo' });
Catalogo.hasMany(Pedido, { foreignKey: 'catalogoId', as: 'pedidos' });

Venta.hasMany(Pedido, {foreignKey: 'ventaId', sourceKey: 'id', as: 'pedidos'});
Pedido.belongsTo(Venta, {foreignKey: 'ventaId', targetKey: 'id', as: 'ventas'});

module.exports = { Pedido };