import Products from '../models/7_Product.model.js';
import Reservations from '../models/10_Reservation.model.js';
import ReservationDetails from '../models/11_ReservationDetail.model.js';
import Images from '../models/8_Image.model.js';
import Categories from '../models/6_Category.model.js';
import Purchases from '../models/16_Purchase.model.js';

export const getProducts = async (req, res) => {
    const {start_date, end_date} = req.body
    if (!(start_date && end_date)) {
        const allProducts = await Products.findAll();
        const products = await Promise.all(allProducts.map(async (prod) => {
            const allImages = await Images.findAll({ where: { id_product: prod.id_product } });
            const category = await Categories.findByPk(prod.id_category);
            const images = await Promise.all(allImages.map(async (img) => {
                return img.path_image
            }))
            prod.setDataValue('images', images);
            prod.setDataValue('category', category.name)
            prod.setDataValue('disponibility', prod.total_quantity);
            return prod;
        }));

        return res.status(200).json({
            ok: true,
            status: 200,
            body: products,
        });
    };

    const start = new Date(start_date);
    const end = new Date(end_date);
    try {
        const allReservations = await Reservations.findAll();

        const reservationsIdsInRange = allReservations
            .filter((res) => {
                return (
                    new Date(res.start_date) <= end &&
                    new Date(res.end_date) >= start &&
                    (res.status == "Aprobada")
                );
            })
            .map((res) => res.id_reservation);

        console.log("IDS Reservas: ", reservationsIdsInRange)
        let reservationDetailsInRange = await Promise.all(
            reservationsIdsInRange.map(async (id) => {
                return await ReservationDetails.findAll({
                    where: { id_reservation: id },
                });
            })
        );
        reservationDetailsInRange = reservationDetailsInRange.flat();

        const allProducts = await Products.findAll();   
        
        const products = await Promise.all(allProducts.map(async(prod) => {
            const allImages = await Images.findAll({ where: { id_product: prod.id_product } });
            const category = await Categories.findByPk(prod.id_category);
            const images = await Promise.all(allImages.map(async (img) => {
                return img.path_image
            }));
            prod.setDataValue('images', images);
            prod.setDataValue('category', category.name)
            let disponibility = prod.total_quantity;
            reservationDetailsInRange.forEach((detail) => {
                if (detail.id_product == prod.id_product) {
                    disponibility -= detail.quantity
                }
            })
            if (disponibility < 0) {
                prod.setDataValue('disponibility', 0);
            } else {
                prod.setDataValue('disponibility', disponibility);
            }
            return prod
        }));

        res.status(200).json({
            ok : true,
            status : 200,
            body : products
        });

    } catch (err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err : err.message
        });
    }
};

export const getProductsCatalog = async (req, res) => {
    const { start_date, end_date } = req.body;
    try {
      if (!(start_date && end_date)) {
        const allProducts = await Products.findAll({ where: { status: true } });
  
        const products = await Promise.all(
          allProducts.map(async (prod) => {
            const allImages = await Images.findAll({ where: { id_product: prod.id_product } });
            const images = allImages.map((img) => img.path_image);
  
            prod.setDataValue("images", images);
            prod.setDataValue("disponibility", prod.total_quantity);
  
            return prod;
          })
        );
  
        // Filtrar productos con disponibilidad mayor a 0
        const availableProducts = products.filter((prod) => prod.getDataValue("disponibility") > 0);
  
        return res.status(200).json({
          ok: true,
          status: 200,
          body: availableProducts,
        });
      }
  
      const start = new Date(start_date);
      const end = new Date(end_date);
  
      const allReservations = await Reservations.findAll();
  
      const reservationsIdsInRange = allReservations
        .filter((res) => {
          return (
            new Date(res.start_date) <= end &&
            new Date(res.end_date) >= start &&
            (res.status === "Aprobada")
          );
        })
        .map((res) => res.id_reservation);
  
      let reservationDetailsInRange = await Promise.all(
        reservationsIdsInRange.map(async (id) => {
          return await ReservationDetails.findAll({
            where: { id_reservation: id },
          });
        })
      );
  
      reservationDetailsInRange = reservationDetailsInRange.flat();
  
      const allProducts = await Products.findAll({ where: { status: true } });
  
      const products = await Promise.all(
        allProducts.map(async (prod) => {
          const allImages = await Images.findAll({ where: { id_product: prod.id_product } });
          const images = allImages.map((img) => img.path_image);
  
          prod.setDataValue("images", images);
          let disponibility = prod.total_quantity;
  
          reservationDetailsInRange.forEach((detail) => {
            if (detail.id_product === prod.id_product) {
              disponibility -= detail.quantity;
            }
          });
  
          prod.setDataValue("disponibility", Math.max(disponibility, 0));
          return prod;
        })
      );
      const availableProducts = products.filter((prod) => prod.getDataValue("total_quantity") > 0);
  
      return res.status(200).json({
        ok: true,
        status: 200,
        body: availableProducts,
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        status: 400,
        err: err.message,
      });
    }
  };
  

export const getProductById = async(req, res) => {
    const {id} = req.params;
    try {
        const product = await Products.findByPk(id);
        const allImages = await Images.findAll({ where: { id_product: product.id_product } });
            const images = await Promise.all(allImages.map(async (img) => {
                return img.path_image
            }))
        product.setDataValue('images', images);
        res.status(200).json({
            ok : true,
            status : 200,
            body : product
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getProductsByCategory = async(req, res) => {
    const {id} = req.params;
    try {
        const allProducts = await Products.findAll({where : {id_category : id}});

        const products = await Promise.all(allProducts.map(async (prod) => {
            const allImages = await Images.findAll({ where: { id_product: prod.id_product } });
            const images = await Promise.all(allImages.map(async (img) => {
                return img.path_image
            }))
            prod.setDataValue('images', images);
            return prod;
        }));

        res.status(200).json({
            ok : true,
            status : 200,
            body : products
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};

export const createProduct = async(req, res) => {
    const {name, total_quantity, price, description, id_category, status = true} = req.body;
    try {
        const createdProduct = await Products.create({name, total_quantity, price, description, id_category, status});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Product",
            body : createdProduct
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateProductById = async(req, res) => {
    const {id} = req.params;
    const {name, total_quantity, price, description, id_category, status} = req.body;
    try {
        const [updatedProduct] = await Products.update({name, total_quantity, price, description, id_category, status}, {where : {id_product : id}});
        let isUpdated;
        updatedProduct <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Product",
            body : {
                affectedRows : updatedProduct,
                isUpdated
            }
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const changeStatusById = async(req, res) => {
    const {id} = req.params;
    try {
        const product = await Products.findByPk(id);
        const newStatus = product.status == 1 ? 0 : 1;
        const patchedProduct = await Products.update({status : newStatus}, {where : {id_product : id}});
        let isPatched;
        patchedProduct <= 0 ? (isPatched = false) : (isPatched = true);
        console.log(newStatus)
        res.status(201).json({
            ok : true,
            status : 201,
            body : {
                patchedProduct,
                isPatched
            }
        });
    }  catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const deleteProductById = async(req, res) => {
    const {id} = req.params;
    try {
        const details = await ReservationDetails.findAll({where : {id_product : id}});
        if (details.length > 0) {
            return res.status(200).json({
                ok : false,
                status : 200,
                message : "Hay Reservas con este producto asociado, no podemos eliminar tu producto"
            });
        }
        
        const deletedProduct = await Products.destroy({where : {id_product : id}});
        let isDeleted;
        deletedProduct <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedProduct,
                isDeleted
            }
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};
