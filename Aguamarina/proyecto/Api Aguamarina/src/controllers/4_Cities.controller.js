import Cities from '../models/4_City.model.js'
import Reservation from '../models/10_Reservation.model.js';

export const getCities = async(req, res) => {
    const cities = await Cities.findAll();
    const reservations = await Reservation.findAll();

    cities.forEach((city) => {
        const quantity = reservations.filter(
            (reservation) =>
                reservation.city === city.name &&
                (reservation.status === "Aprobada" || reservation.status === "Finalizada")
        ).length;

        city.setDataValue('quantity', quantity);
    });

    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : cities
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getCityById = async(req, res) => {
    const {id} = req.params;
    try {
        const cities = await Cities.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : cities
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createCity = async(req, res) => {
    const {name} = req.body;
    try {
        const createdCity = await Cities.create({name});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created City",
            body : createdCity
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateCityById = async(req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    try {
        const [updatedCity] = await Cities.update({name}, {where : {id_city : id}});
        let isUpdated;
        updatedCity <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated City",
            body : {
                affectedRows : updatedCity,
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

export const deleteCityById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedCity = await Cities.destroy({where : {id_city : id}});
        let isDeleted;
        deletedCity <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedCity,
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