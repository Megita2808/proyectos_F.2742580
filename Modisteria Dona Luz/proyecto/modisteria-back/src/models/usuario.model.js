const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { Domicilio } = require('./domicilio.model.js');
const { Pedido } = require('./pedido.model.js');
const { Cita } = require('../models/cita.model.js')

const Usuario = sequelize.define('Usuario',
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    codigo:{
      type:DataTypes.STRING,
      allowNull:true
    },
    exp_cod:{
      type:DataTypes.DATE,
      allowNull: true
    }
    
  },
  {
    timestamps: true,
  },
);

//Relacion usuario y cita
Usuario.hasMany(Cita, {foreignKey: 'usuarioId', sourceKey: 'id', as: 'cita'});
Cita.belongsTo(Usuario, {foreignKey: 'usuarioId', targetKey: 'id', as: 'usuario'});

//Relación usuario y carrito (pedido)
Usuario.hasMany(Pedido, {foreignKey:'usuarioId', sourceKey:'id', as:"pedido"})
Pedido.belongsTo(Usuario, {foreignKey:'usuarioId', sourceKey:'id', as:'usuario'})


module.exports = { Usuario };