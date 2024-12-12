const {Verificacion} = require('../models')
const {Op} = require("sequelize");

exports.createVerify = async(verificacion)=>{
    return await Verificacion.create(verificacion);
}
exports.updateVerify = async (verificacion) => {
    return await Verificacion.update({
        codigo: verificacion.codigo,
        expiracion: verificacion.expiracion
    }, {
        where: {email: verificacion.email}
    })
}
exports.getCodigoByEmail = async (email) => {
    try {
        const verification = await Verificacion.findOne({where: { email: email },attributes: ['codigo'] });
        return verification ? verification.codigo : null;
    } catch (error) {
        throw error;
    }

};
exports.getEmailIsInVerification = async (email) => {
    try {
        const verification = await Verificacion.count({where: { email: email }});
        return verification == 0 ? false : true
    } catch (error) {
        throw error;
    }
}