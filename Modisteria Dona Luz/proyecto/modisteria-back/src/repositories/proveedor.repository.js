const {Proveedor} = require("../models");

exports.getAllProveedores = async () => {
    return await Proveedor.findAll();
};

exports.getProveedorById = async (id) => {
    return await Proveedor.findByPk(id);
}

exports.createProveedor = async (proveedor) => {
    return await Proveedor.create(proveedor);
}

exports.updateProveedor = async (id, proveedor) => {
    return await Proveedor.update(proveedor, { where: { id } });
}
exports.deleteProveedor = async (id) => {
    return await Proveedor.destroy({ where: { id } });
}
