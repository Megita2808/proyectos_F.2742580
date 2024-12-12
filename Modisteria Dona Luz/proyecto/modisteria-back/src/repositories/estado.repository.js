const { Estado, Usuario, Permiso, Role, Domicilio, Cita, Venta, Catalogo, Categoria, Insumo, Cotizacion } = require("../models");

exports.getAllEstados = async () => {
    return await Estado.findAll();
};

exports.getEstadoById = async (id) => {
    return await Estado.findByPk(id);
}

exports.createEstado = async (estado) => {
    return await Estado.create(estado);
}

exports.updateEstado = async (id, estado) => {
    return await Estado.update(estado, { where: { id } });
}

exports.statusEstado = async (id) => {
    return await Estado.update({ estado: false }, { where: { id } });
}
exports.deleteEstado = async (id) => {
    const estado = await Estado.findByPk(id);
    
    if (!estado) {
        throw new Error("Estado no encontrado");
    }
    const existeEnUsuario = await Usuario.findOne({ where: { estadoId: id } });
    const existeEnPermiso = await Permiso.findOne({ where: { estadoId: id } });
    const existeEnRole = await Role.findOne({ where: { estadoId: id } });
    const existeEnDomicilio = await Domicilio.findOne({ where: { estadoId: id } });
    const existeEnCita = await Cita.findOne({ where: { estadoId: id } });
    const existeEnVenta = await Venta.findOne({ where: { estadoId: id } });
    const existeEnCatalogo = await Catalogo.findOne({ where: { estadoId: id } });
    const existeEnCategoria = await Categoria.findOne({ where: { estadoId: id } });
    const existeEnInsumo = await Insumo.findOne({ where: { estadoId: id } });
    const existeEnCotizacion = await Cotizacion.findOne({ where: { estadoId: id } });
    
    if (existeEnUsuario || existeEnPermiso || existeEnRole || existeEnDomicilio || existeEnCita || existeEnVenta || existeEnCatalogo || existeEnCategoria || existeEnInsumo || existeEnCotizacion) {
        throw new Error("No se puede eliminar el estado porque está asociado a otro registro");
    }
    return await Estado.destroy({ where: { id } });
}


