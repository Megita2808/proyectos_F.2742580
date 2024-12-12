const { Cita, Insumo, CitaInsumo } = require('../models');
const { getAllCitaInsumoByCitaID } = require('../repositories/cita_insumo.repository')
const { getAllCatInsByCatalogoID } = require('../repositories/catalogo_insumos.repository')
const { getCitaById } = require('../repositories/cita.repository');
const { getAllInfoByVentaID } = require('../repositories/venta.repository');

//Ficha técnica de cita
exports.ftCita = async (req, res) => {
    const { citaId } = req.body
    const citas = await getAllCitaInsumoByCitaID(citaId)
    const cita = await getCitaById(citaId)
    const fichaTecnica = {
        citaId: cita.id,
        fecha: cita.fecha,
        precio: cita.precio,
        insumos: citas.map(ci => ({
            insumoId: ci.insumo_id,
            cantidadUtilizada: ci.cantidad_utilizada
        }))
    };
    res.status(201).json(fichaTecnica)
}

//Ficha técnica de catálogo
const datosProcesados = async (ventas) => {
    if (!ventas || ventas.length === 0) {
        return null; 
    }

    const pedidos = await Promise.all(ventas.map(async (item) => {
        const catalogoId = item['pedido.catalogo.id'];

        const insumos = await getAllCatInsByCatalogoID(catalogoId);

        return {
            pedidoId: item['pedidoId'],
            catalogoId: catalogoId,
            producto: item['pedido.catalogo.producto'],
            talla: item['pedido.talla'],
            cantidad: item['pedido.cantidad'],
            precio: item['pedido.catalogo.precio'],
            insumos: insumos
        };
    }));

    const fichaTecnica = {
        metodoPago: ventas[0]['metodoPago'],
        nombrePersona: ventas[0]['nombrePersona'],
        valorFinal: ventas[0]['valorFinal'],
        pedidos: pedidos
    };

    return fichaTecnica;
};

exports.ftCatalogo = async (req, res) => {
    try {
        const { ventaId } = req.body;
        
        const ventas = await getAllInfoByVentaID(ventaId);
        const datos = await datosProcesados(ventas);

        if (datos) {
            return res.status(200).json(datos);
        } else {
            return res.status(404).json({ message: "No se encontraron datos." });
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
