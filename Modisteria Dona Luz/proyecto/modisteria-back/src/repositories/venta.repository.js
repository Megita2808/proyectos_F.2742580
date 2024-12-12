const { Venta, Cotizacion, CotizacionPedidos, Pedido, Catalogo, Usuario } = require("../models");
const {getPriceById, getDateById} = require('../repositories/cita.repository.js')
const {Cita} = require('../models/cita.model.js') 

exports.getAllVentas = async () => {
    return await Venta.findAll();
};

exports.getCitaVenta = async (citaId) => {
    return await Venta.findAll({
        where: { citaId },
        limit: 1 
      });
};

exports.updateVenta = async (id, imagen) => {
    return await Venta.update(imagen, { where: { id } });
  };

exports.getVentaById = async (id) => {
    return await Venta.findByPk(id);
};

exports.createVenta = async (venta) => {
    return await Venta.create(venta);
};

exports.updateVentaAC = async (citaId, cambio) => {
    return await Venta.update(cambio, { where: { citaId: citaId } });
};


exports.updateVenta = async (id, venta) => {
    return await Venta.update(venta, { where: { id } });
}

exports.getAllInfoByVentaID = async (ventaId) => {
    return await Venta.findOne({
        where: { id: ventaId },
        include: [
            {
                model: Pedido,
                as: 'pedidos',
                attributes: ['catalogoId', 'tallaId', 'cantidad', 'usuarioId'],
                include: [
                    {
                        model: Catalogo,
                        as: 'catalogo',
                        attributes: ['id', 'producto', 'precio'],
                    }
                ]
            }
        ],
        raw: true
    });
};


exports.getVentaByUsuarioId = async (usuarioId) => {
    const ventaByUsuario = await Venta.findAll({
        where: {
            '$pedidos.usuarioId$': usuarioId 
        },
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
    });

    if (ventaByUsuario.length === 0) {
        return {
            message: `No se encontraron ventas del usuario con ID ${usuarioId}.`,
            status: 404
        };
    }

    return ventaByUsuario;
};

