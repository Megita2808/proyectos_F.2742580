const { Domicilio, Usuario, Venta, Pedido, Estado } = require("../models");

exports.getAllDomicilios = async () => {
    return await Domicilio.findAll({
        include: [
            {
                model: Venta,
                as: 'ventas',
                include: [
                    {
                        model: Pedido,
                        as: 'pedidos',
                        include: [
                            {
                                model: Usuario,
                                as: 'usuario',
                            }
                        ]
                    }
                ]
            }
        ]
    });
};

exports.getDomicilioById = async (id) => {
    return await Domicilio.findOne({
        where: { id },
        include: [
            {
                model: Venta,
                as: 'ventas',
                include: [
                    {
                        model: Pedido,
                        as: 'pedidos',
                        include: [
                            {
                                model: Usuario,
                                as: 'usuario',
                            }
                        ]
                    }
                ]
            }
        ]
    });
};

exports.getDomiciliosByClienteId = async (clienteId) => {
    try {
        const domicilios = await Domicilio.findAll({
            include: [
                {
                    model: Venta,
                    as: 'ventas',
                    include: [
                        {
                            model: Pedido,
                            as: 'pedidos',
                            include: [
                                {
                                    model: Usuario,
                                    as: 'usuario'
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                '$ventas.pedidos.usuarioId$': clienteId
            }
        });

        if (domicilios.length === 0) {
            return {
                message: `No se encontraron domicilios para el cliente con ID ${clienteId}.`,
                status: 404
            };
        }

        return domicilios;

    } catch (error) {
        console.error("Error al obtener los domicilios:", error);
        throw error;
    }
};

exports.createDomicilio = async (domicilio) => {
    return await Domicilio.create(domicilio);
};

exports.createDomicilioVenta = async (ventaId, direccion, valorDomicilio) => {
    try {
        const venta = await Venta.findByPk(ventaId);

        if (!venta) {
            throw new Error('Venta no encontrada');
        }

        const nuevoDomicilio = await Domicilio.create({
            numeroGuia: null,
            ventaId: venta.id,
            estadoId: 3,
            tarifa: valorDomicilio,
            direccion: direccion
        });

        return nuevoDomicilio;

    } catch (error) {
        console.error('Error al crear el domicilio para la venta:', error);
        throw error;
    }
};

exports.getDomicilioByVentaId = async (id) => {
    try {
        const domicilio = await Domicilio.findOne({
            where: { ventaId: id }
        });

        if (!domicilio) {
            throw new Error('No se encontró el domicilio para el ventaId proporcionado');
        }

        return domicilio;
    } catch (error) {
        console.error('Error al obtener el domicilio:', error.message);
        throw error;
    }
};


exports.updateDomicilio = async (id, domicilio) => {
    return await Domicilio.update(domicilio, { where: { id } });
}

exports.statusDomicilio = async (id, estadoId) => {
    return await Domicilio.update({ estadoId }, { where: { id } });
};
exports.deleteDomicilio = async (id) => {
    const domicilio = await Domicilio.findByPk(id);

    if (!domicilio) {
        throw new Error("Domicilio no encontrado");
    }

    const existeUsuario = await Usuario.findOne({ where: { id: domicilio.usuarioId } });
    const existeEstado = await Estado.findOne({ where: { id: domicilio.estadoId } });
    const existeVenta = await Venta.findOne({ where: { id: domicilio.ventaId } });

    if (existeUsuario || existeEstado || existeVenta) {
        throw new Error("No se puede eliminar el domicilio porque está asociado a registros en otras tablas");
    }

    return await Domicilio.destroy({ where: { id } });
}

