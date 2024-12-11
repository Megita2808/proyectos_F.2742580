import ReservationDetails from '../models/11_ReservationDetail.model.js'

export const getReservationDetails = async(req, res) => {
    const details = await ReservationDetails.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : details
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getDetailsByReservation = async(req, res) => {
    const {id} = req.params;
    try {
        const details = await ReservationDetails.findAll({where : {id_reservation : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : details
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createReservationDetails = async(req, res) => {
    const {id_reservation, id_product, quantity, unit_price, total_price} = req.body;
    try {
        const createdDetail = await ReservationDetails.create({id_reservation, id_product, quantity, unit_price, total_price});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Detail",
            body : createdDetail
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateReservationDetailById = async(req, res) => {
    const {id_reservation, id_product} = req.body;
    const {quantity, unit_price, total_price} = req.body;
    try {
        const [updatedDetail] = await ReservationDetails.update({quantity, unit_price, total_price}, {where : {id_reservation, id_product}});
        let isUpdated;
        updatedDetail <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Detail",
            body : {
                affectedRows : updatedDetail,
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

export const deleteReservationDetailById = async(req, res) => {
    const {id_reservation, id_product} = req.body;
    try {
        const deletedDetail = await ReservationDetails.destroy({where : {id_reservation, id_product}});
        let isDeleted;
        deletedDetail <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedDetail,
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