const mongoose = require('mongoose');
const Categoria = require('../../../modules/Catalogo/categoria');
const Module = require('../../../modules/Img/imagen');

const CatalogoGet = async (req, res) => {
  try {
    const catalogoCompleto = await Categoria.find({ estado: true })
      .select('_id nombreCategoria producto imagen')
      .populate({
        path: 'producto',
        model: 'Producto',
        select: '_id nombreProducto medidaProducto imagen',
        populate: [
          {
            path: 'medidaProducto',
            model: 'MedidaProducto',
            select: '-estado',
            populate: [
              {
                path: 'longitudMedida.unidadMedida',
                model: 'UnidadMedida',
                select: '_id nombre simbolo',
              },
              {
                path: 'peso.valores.valor',
                model: 'Peso',
                select: '_id peso',
              },
              {
                path: 'peso.unidadMedida',
                model: 'UnidadMedida',
                select: '_id nombre simbolo',
              },
              {
                path: 'colores.PrecioVenta',
                model: 'PrecioVenta',
                select: '_id precioUnitario unidadMedida color',
                populate: [
                  {
                    path: 'unidadMedida',
                    model: 'UnidadMedida',
                    select: '_id nombre simbolo',
                  },
                  {
                    path: 'color',
                    model: 'Color',
                    select: '_id nombreColor',
                  },
                ]
              },
              {
                path: 'medidaVenta',
                model: 'MedidaVenta',
                select: '_id longitudMedida peso colores',
                populate: [
                  {
                    path: 'longitudMedida.unidadMedida',
                    model: 'UnidadMedida',
                    select: '_id nombre simbolo',
                  },
                  {
                    path: 'peso.valores.valor',
                    model: 'Peso',
                    select: '_id peso',
                    // select: '_id peso unidadMedida',
                    // populate: {
                    //   path: 'unidadMedida',
                    //   model: 'UnidadMedida',
                    //   select: '_id nombre simbolo',
                    // },
                  },
                  {
                    path: 'colores.PrecioVenta',
                    model: 'PrecioVenta',
                    select: '_id precioUnitario unidadMedida color',
                    populate: [
                      {
                        path: 'unidadMedida',
                        model: 'UnidadMedida',
                        select: '_id nombre simbolo',
                      },
                      {
                        path: 'color',
                        model: 'Color',
                        select: '_id nombreColor',
                      },
                    ]
                  },
                ]
              }
            ]
          }
        ]
      });

      const categoriasConImagenUrl = await Promise.all(
        catalogoCompleto.map(async (categoria) => {
          const moduleCategoria = await Module.findOne({ 'images._id': categoria.imagen }).exec();
          const imagenCategoria = moduleCategoria ? moduleCategoria.images.id(categoria.imagen) : null;
      
          const productosConImagenUrl = await Promise.all(
            categoria.producto.map(async (producto) => {
              const moduleProducto = await Module.findOne({ 'images._id': producto.imagen }).exec();
              const imagenProducto = moduleProducto ? moduleProducto.images.id(producto.imagen) : null;
      
              const medidasConImagen = await Promise.all(
                producto.medidaProducto.map(async (medidaProducto) => {
                  const medidasVentaConImagen = await Promise.all(
                    medidaProducto.medidaVenta.map(async (medidaVenta) => {
                      const coloresConImagenes = await Promise.all(medidaVenta.colores.map(async color => {
                        const module = await Module.findOne({ 'images._id': color.imagen }).exec();
                        const imagenCompleta = module ? module.images.id(color.imagen) : null;
      
                        return {
                          ...color.toObject(),
                          idImagen: imagenCompleta ? color.imagen : null,
                          imagen: imagenCompleta ? imagenCompleta.imageUrl : null
                        };
                      }));
      
                      return {
                        ...medidaVenta.toObject(),
                        colores: coloresConImagenes
                      };
                    })
                  );
      
                  return {
                    ...medidaProducto.toObject(),
                    medidaVenta: medidasVentaConImagen
                  };
                })
              );
      
              return {
                _id: producto._id,
                nombreProducto: producto.nombreProducto,
                medidaProducto: medidasConImagen,
                imagenProducto: imagenProducto ? imagenProducto.imageUrl : null,
              };
            })
          );
      
          return {
            _id: categoria._id,
            nombreCategoria: categoria.nombreCategoria,
            imagenCategoria: imagenCategoria ? imagenCategoria.imageUrl : null,
            productos: productosConImagenUrl,
          };
        })
      );

    res.json({ catalogo: categoriasConImagenUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el catálogo', error: error.message });
  }
};

module.exports = { 
  CatalogoGet,
}