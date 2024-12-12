const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');
const { RolesPermisos } = require('./roles_permisos.model.js');

const Permiso = sequelize.define('Permiso',
  {
     nombre: {
       type: DataTypes.STRING,
       allowNull: false,
     },
    descripcion: {
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
  },
);

// Permiso.hasMany(RolesPermisos, {foreignKey: 'permisoId', sourceKey: 'id', as: 'roles_permisos'});
// RolesPermisos.belongsTo(Permiso, {foreignKey: 'permisoId', targetKey: 'id', as: 'permiso'});

module.exports = { Permiso };

