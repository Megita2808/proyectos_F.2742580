import Reservations from '../models/10_Reservation.model.js'
import ReservationDetail from '../models/11_ReservationDetail.model.js';
import Details from '../models/11_ReservationDetail.model.js'
import sequelize from '../db/sequelize.js';
import Address from '../models/5_Address.model.js';
import City from "../models/4_City.model.js";
import Image from "../models/8_Image.model.js";
import dayjs from 'dayjs';
import User from '../models/18_User.model.js';
import Loss from '../models/17_Loss.model.js';
import LossDetail from '../models/17_5_LossDetail.model.js';
import Product from '../models/7_Product.model.js';
import { Op } from "sequelize";


export const getReservations = async(req, res) => {
    const allReservations = await Reservations.findAll();
    try {
        const reservations = await Promise.all(allReservations.map(async (reserva) => {
            const details = await Details.findAll({ where: { id_reservation: reserva.id_reservation } });


            await Promise.all(details.map(async (detail) => {
                const paths = await Image.findAll({where : {id_product : detail.id_product}});
                const product = await Product.findByPk(detail.id_product);
                const urls = paths.map(img => img.path_image);
                detail.setDataValue('name', product.name);
                detail.setDataValue('urls', urls);
            }));

            const user = await User.findByPk(reserva.id_user);
            const fullname = user.names + " " + user.lastnames;
            reserva.setDataValue('name_client', fullname);

            reserva.setDataValue('details', details);
            return reserva;
        }));
        res.status(200).json({
            ok : true,
            status : 200,
            body : reservations
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getReservationById = async(req, res) => {
    const {id} = req.params;
    try {
        const reservation = await Reservations.findByPk(id);
        const details = await Details.findAll({ where: { id_reservation: reservation.id_reservation } });
        reservation.setDataValue('details', details);
        const user = await User.findByPk(res.id_user);
            const name = user.name;
            res.setDataValue('name_client', name);
        res.status(200).json({
            ok : true,
            status : 200,
            body : reservation
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getReservationsByUser = async(req, res) => {
    const {id} = req.params;
    try {
        const allReservations = await Reservations.findAll({where : {id_user : id}});
        const reservations = await Promise.all(allReservations.map(async (res) => {
            const details = await Details.findAll({ where: { id_reservation: res.id_reservation } });
            res.setDataValue('details', details);
            return res;
        }));
        res.status(200).json({
            ok : true,
            status : 200,
            body : reservations
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createReservation = async (req, res) => {
    const { id_user, start_date, end_date, id_address, shipping_cost = 0, type_shipping, deposit = 0, type_payment, details = [], status= "En Espera", } = req.body;

    const transaction = await sequelize.transaction();
    const address = await Address.findByPk(id_address);

    try {
        const start = dayjs(start_date);
        const end = dayjs(end_date);
        const res_days = end.diff(start, "day") + 1 //Cantidad de dias de la duración de la reserva
        const three_days_range = Math.ceil(res_days / 3) //Cobrar el valor cada 3 dias de alquiler
        const city = await City.findByPk(address.id_city);
        const createdReservation = await Reservations.create({
            id_user,
            start_date,
            end_date,
            address : address.address,
            city : city.name,
            neighborhood : address.neighborhood,
            reference : address.reference,
            shipping_cost,
            type_shipping,
            deposit,
            type_payment,
            status
        }, { transaction });

        const id_reservation = createdReservation.id_reservation;


        let subtotal_reservations = 0;

        // Crear los detalles de la reserva dentro de la transacción
        const detailsList = await Promise.all(details.map(async (detail) => {
            const productDetail = await Product.findByPk(detail.id_product, { transaction });

            if (!productDetail) {
                throw new Error(`Product with ID ${detail.id_product} not found`);
            }

            const createdDetail = await Details.create({
                id_reservation,
                id_product: detail.id_product,
                quantity: detail.quantity,
                unit_price: productDetail.price,
                total_price: detail.quantity * productDetail.price
            }, { transaction });

            subtotal_reservations += parseFloat(createdDetail.total_price);
            return createdDetail;
        }));

        let total_reservation = parseFloat(subtotal_reservations) + parseFloat(shipping_cost) + parseFloat(deposit);
        

        // Actualizar el total de la reserva
        await Reservations.update({ subtotal_reservations, total_reservation }, { where: { id_reservation }, transaction });

        // Confirmar la transacción
        await transaction.commit();

        // Enviar respuesta exitosa
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Reservation created successfully",
            body: { reservation: createdReservation, details: detailsList }
        });
    } catch (err) {
        // Si hay un error, deshacer los cambios
        await transaction.rollback();
        res.status(400).json({
            ok: false,
            status: 400,
            error: err.message || err
        });
    }
};

export const createReservationDashboard = async (req, res) => {
    const { id_user, start_date, end_date, address, city, neighborhood, reference, shipping_cost = 0, type_shipping, deposit = 0, type_payment, details = [], status= "Aprobada",} = req.body;

/*
 
: 
0
type_payment
: 
"Transferencia"
type_shipping
: 
"Recogida y Entrega"
    
    */


    const transaction = await sequelize.transaction();

    try {
        const start = dayjs(start_date);
        const end = dayjs(end_date);
        const res_days = end.diff(start, "day") + 1 //Cantidad de dias de la duración de la reserva
        const three_days_range = Math.ceil(res_days / 3) //Cobrar el valor cada 3 dias de alquiler
        const createdReservation = await Reservations.create({
            id_user,
            start_date,
            end_date,
            address,
            city,
            neighborhood : neighborhood,
            reference : reference,
            shipping_cost,
            type_shipping,
            deposit,
            type_payment,
            status
        }, { transaction });

        const id_reservation = createdReservation.id_reservation;
        let subtotal_reservations = 0;

        // Crear los detalles de la reserva dentro de la transacción
        const detailsList = await Promise.all(details.map(async (detail) => {
            const productDetail = await Product.findByPk(detail.id_product, { transaction });

            if (!productDetail) {
                throw new Error(`Product with ID ${detail.id_product} not found`);
            }

            const createdDetail = await Details.create({
                id_reservation,
                id_product: detail.id_product,
                quantity: detail.quantity,
                unit_price: productDetail.price,
                total_price: detail.quantity * productDetail.price
            }, { transaction });

            subtotal_reservations += parseFloat(createdDetail.total_price);
            return createdDetail;
        }));

        let total_reservation = parseFloat(subtotal_reservations) + parseFloat(shipping_cost) + parseFloat(deposit);

        // Actualizar el total de la reserva
        await Reservations.update({ subtotal_reservations, total_reservation }, { where: { id_reservation }, transaction });

        // Confirmar la transacción
        await transaction.commit();

        // Enviar respuesta exitosa
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Reservation created successfully",
            body: { reservation: createdReservation, details: detailsList }
        });
    } catch (err) {
        // Si hay un error, deshacer los cambios
        await transaction.rollback();
        res.status(400).json({
            ok: false,
            status: 400,
            error: err.message || err
        });
    }
};


export const updateReservationById = async(req, res) => {
    const {id} = req.params;
    const {id_user, start_date, end_date, adress, city, neighborhood, reference, status} = req.body;
    try {
        const [updatedReservation] = await Reservations.update({id_user, start_date, end_date, adress, city, neighborhood, reference, status}, {where : {id_reservation : id}});
        let isUpdated;
        updatedReservation <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Reservation",
            body : {
                affectedRows : updatedReservation,
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

export const deleteReservationById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedReservation = await Reservations.destroy({where : {id_reservation : id}});
        let isDeleted;
        deletedReservation <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedReservation,
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

// export const approveReservationById = async(req, res) => {
//     const {id} = req.params;
//     const newStatus = "Aprobada"
//     try {
//         const [approvedReservation] = await Reservations.update({status : newStatus}, {where : {id_reservation : id}});
//         let isApproved;
//         approvedReservation <= 0 ? (isApproved = false) : (isApproved = true);
//         res.status(200).json({
//             ok : true,
//             status : 200,
//             message : "Approved Reservation",
//             body : {
//                 affectedRows : approvedReservation,
//                 isApproved
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             ok : false,
//             status : 400,
//             err
//         });
//     }
// };



export const approveReservationById = async (req, res) => {
    const { id } = req.params;
    const newStatus = "Aprobada";

    try {
        // Buscar la reserva
        const reservation = await Reservations.findByPk(id);
        if (!reservation) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Reserva no encontrada.",
            });
        }

        // Obtener los detalles de la reserva
        const reservationDetails = await ReservationDetail.findAll({
            where: { id_reservation: id },
        });

        if (!reservationDetails || reservationDetails.length === 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "No se encontraron detalles para la reserva.",
            });
        }

        // Obtener todos los productos involucrados en la reserva
        const productIds = reservationDetails.map((detail) => detail.id_product);
        const products = await Product.findAll({
            where: { id_product: productIds },
        });

        // Verificar la disponibilidad de cada producto
        let hasEnoughStock = true;
        const failedProducts = []; // Array para almacenar los productos fallidos

        for (const detail of reservationDetails) {
            const product = products.find((p) => p.id_product === detail.id_product);

            if (!product) {
                hasEnoughStock = false;
                failedProducts.push({
                    id_product: detail.id_product,
                    name: "Producto no encontrado", // Si no se encuentra el producto
                    quantity: detail.quantity,
                    disponibility: 0,
                    reason: "Producto no encontrado",
                });
                break;
            }

            // Obtener todas las reservas aprobadas en el rango de fechas
            const overlappingReservations = await Reservations.findAll({
                where: {
                    status: "Aprobada",
                    [Op.and]: [
                        { start_date: { [Op.lte]: reservation.end_date } },
                        { end_date: { [Op.gte]: reservation.start_date } },
                    ],
                },
            });

            const overlappingReservationIds = overlappingReservations.map(
                (res) => res.id_reservation
            );

            // Sumar las cantidades reservadas para el producto en las reservas coincidentes
            const totalReserved = await ReservationDetail.sum("quantity", {
                where: {
                    id_product: product.id_product,
                    id_reservation: overlappingReservationIds,
                },
            });

            const availableStock = product.total_quantity - totalReserved;

            if (availableStock < detail.quantity) {
                hasEnoughStock = false;
                failedProducts.push({
                    id_product: product.id_product,
                    name: product.name, // Asumiendo que el producto tiene un campo 'name'
                    quantity: detail.quantity,
                    disponibility: availableStock,
                    reason: "Stock insuficiente",
                });
            }
        }

        // Si no hay suficiente stock, retornar los productos fallidos
        if (!hasEnoughStock) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "No hay suficiente stock para aprobar esta reserva.",
                failedProducts: failedProducts, // Devolver los productos fallidos
            });
        }

        // Aprobar la reserva
        const [approvedReservation] = await Reservations.update(
            { status: newStatus },
            { where: { id_reservation: id } }
        );

        if (approvedReservation <= 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "No se pudo encontrar la reserva para aprobar.",
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Reserva aprobada exitosamente.",
            body: {
                affectedRows: approvedReservation,
                reservationDetails,
            },
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error interno del servidor.",
            err: err.message,
        });
    }
};


export const denyReservationById = async(req, res) => {
    const {id} = req.params;
    const {cancel_reason} = req.body;
    const newStatus = "Denegada"
    try {
        const [denniedReservation] = await Reservations.update({status : newStatus, cancel_reason : cancel_reason}, {where : {id_reservation : id}});
        let isDennied;
        denniedReservation <= 0 ? (isDennied = false) : (isDennied = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Dennied Reservation",
            body : {
                affectedRows : denniedReservation,
                isDennied
            }
        });
    } catch (err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};

export const cancelReservationById = async(req, res) => {
    const {id} = req.params;
    const {cancel_reason} = req.body;
    const newStatus = "Cancelada"
    try {
        const [canceledReservation] = await Reservations.update({status : newStatus, cancel_reason : cancel_reason}, {where : {id_reservation : id}});
        let isCanceled;
        canceledReservation <= 0 ? (isCanceled = false) : (isCanceled = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Canceled Reservation",
            body : {
                affectedRows : canceledReservation,
                isCanceled
            }
        });
    } catch (err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};

export const annularReservationById = async(req, res) => {
    const {id} = req.params;
    const {cancel_reason} = req.body;
    const newStatus = "Anulada"

    try {
        const [annulledReservation] = await Reservations.update({status : newStatus, cancel_reason : cancel_reason}, {where : {id_reservation : id}});
        let isAnnulled;
        annulledReservation <= 0 ? (isAnnulled = false) : (isAnnulled = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Annulled Reservation",
            body : {
                affectedRows : annulledReservation,
                isAnnulled
            }
        });
    } catch (err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }


}

export const finalizeReservationById = async (req, res) => {
    const { id } = req.params;
    const { id_user, lossesList = [], observations, loss_date } = req.body; //{id_user, [{id_product, quantity}]}

    const newStatus = "Finalizada";
    console.log({ id_user, lossesList, observations, loss_date });

    try {
        const [affectedRows] = await Reservations.update(
            { status: newStatus },
            { where: { id_reservation: id } }
        );

        const isFinalized = affectedRows > 0;

        if (lossesList.length > 0) {
            const lossCreated = await Loss.create({
                id_user,
                loss_date,
                observations
            });

            const createdLossDetails = await Promise.all(
                lossesList.map(async (detail) => {
                    const dataDetail = {
                        id_loss: lossCreated.id_loss,
                        id_product: detail.id_product,
                        quantity: detail.quantity,
                    };
                    const createdDetail = await LossDetail.create(dataDetail);

                    const product = await Product.findByPk(detail.id_product);
                    console.log({ product }, "antes");

                    product.total_quantity -= parseInt(detail.quantity);
                    await product.save();

                    console.log(product, "despues");
                    return createdDetail;
                })
            );
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Finalized Reservation",
            body: {
                affectedRows,
                isFinalized,
            },
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            status: 400,
            err,
        });
    }
};

export const sendMail = async(req,res) => {
    
};