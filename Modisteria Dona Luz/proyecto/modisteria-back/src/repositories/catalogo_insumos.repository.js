const { CatalogoInsumos } = require("../models");

exports.getAllCatIns = async () => {
    return await CatalogoInsumos.findAll();
};

exports.getCatInsById = async (id) => {
    return await CatalogoInsumos.findByPk(id);
}

exports.createCatIns = async (catIns) => {
    return await CatalogoInsumos.create(catIns);
}

exports.updateCatIns = async (id, catIns) => {
    return await CatalogoInsumos.update(catIns, { where: { id } });
}

exports.statusCatIns = async (id) => {
    return await CatalogoInsumos.update({ estado: false }, { where: { id } });
}

exports.deleteCatIns = async (id) => {
    return await CatalogoInsumos.destroy({ where: { id } });
}

exports.getAllCatInsByCatalogoID = async (id) => {
    return await CatalogoInsumos.findAll({ where: { catalogo_id: id } });
};
