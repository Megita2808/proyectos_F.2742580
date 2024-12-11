import Rents from '../models/12_Rent.model.js'

export const getRents = async(req, res) => {
    const rents = await Rents.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : rents
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getRentById = async(req, res) => {
    const {id} = req.params;
    try {
        const rents = await Rents.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : rents
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getRentsByUser = async(req, res) => {
    const {id} = req.params;
    try {
        const rents = await Rents.findAll({where : {id_user : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : rents
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getRentByReservation = async(req, res) => {
    const {id} = req.params;
    try {
        const rents = await Rents.findAll({where : {id_reservation : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : rents
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createRent = async(req, res) => {
    const {id_reservation, id_seller, id_client, status, date_start, date_end, payment} = req.body;
    try {
        const createdRent = await Rents.create({id_reservation, id_seller, id_client, status, date_start, date_end, payment});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Rent",
            body : createdRent
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateRentById = async(req, res) => {
    const {id} = req.params;
    const {id_reservation, id_seller, id_client, status, date_start, date_end, payment} = req.body;
    try {
        const [updatedRent] = await Rents.update({id_reservation, id_seller, id_client, status, date_start, date_end, payment}, {where : {id_rent : id}});
        let isUpdated;
        updatedRent <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Rent",
            body : {
                affectedRows : updatedRent,
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

export const deleteRentById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedRent = await Rents.destroy({where : {id_rent : id}});
        let isDeleted;
        deletedRent <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedRent,
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