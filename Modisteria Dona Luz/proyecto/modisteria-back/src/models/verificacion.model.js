const {DataTypes, Sequelize} = require('sequelize');
const {sequelize} = require('../database/connection.js');

const Verificacion = sequelize.define('Verificacion', {
    email: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    codigo:{
        type:DataTypes.INTEGER
    },
    estado:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    expiracion:{
        type:DataTypes.DATE,
        allowNull: true
    }
},
{
    timestamps:false,
})

module.exports = {Verificacion}