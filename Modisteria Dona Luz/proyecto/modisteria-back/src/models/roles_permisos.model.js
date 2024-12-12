const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection.js');

const RolesPermisos = sequelize.define('RolesPermisos', {
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permisoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'roles_permisos',
    timestamps: false
});

module.exports = { RolesPermisos };
