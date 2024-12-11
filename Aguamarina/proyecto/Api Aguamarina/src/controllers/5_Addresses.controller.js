import Addresses from '../models/5_Address.model.js'

export const getAddresses = async(req, res) => {
    const addresses = await Addresses.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : addresses
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getAddressById = async(req, res) => {
    const {id} = req.params;
    try {
        const addresses = await Addresses.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : addresses
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getAddressesByUser = async(req, res) => {
    const {id} = req.params;
    try {
        const addresses = await Addresses.findAll({where : {id_user : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : addresses
        })
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createAddress = async(req, res) => {
    const {id_user, name, address, id_city, neighborhood, reference} = req.body;
    try {
        const createdAddress = await Addresses.create({id_user, name, address, id_city, neighborhood, reference});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Direccion creada Correctamente",
            body : createdAddress
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            message : "Ha ocurrido un error al intentar crear la Dirección",
            err
        });
    };
};

export const updateAddressById = async(req, res) => {
    const {id} = req.params;
    const {name, address, id_city, neighborhood, reference} = req.body;
    try {
        const [updatedAddress] = await Addresses.update({name, address, id_city, neighborhood, reference}, {where : {id_address : id}});
        let isUpdated;
        updatedAddress <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Address",
            body : {
                affectedRows : updatedAddress,
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

export const deleteAddressById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedAddress = await Addresses.destroy({where : {id_address : id}});
        let isDeleted;
        deletedAddress <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedAddress,
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