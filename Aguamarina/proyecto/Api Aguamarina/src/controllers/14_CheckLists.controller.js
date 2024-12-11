import CheckLists from '../models/14_CheckList.model.js';

export const getCheckLists = async(req, res) => {
    const checkLists = await CheckLists.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : checkLists
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getCheckListById = async(req, res) => {
    const {id} = req.params;
    try {
        const checkLists = await CheckLists.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : checkLists
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getCheckListsByRent = async(req, res) => {
    const {id} = req.params;
    try {
        const checkLists = await CheckLists.findAll({where : {id_rent : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : checkLists
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createCheckList = async(req, res) => {
    const {id_rent, description, status} = req.body;
    try {
        const createdCheckList = await CheckLists.create({id_rent, description, status});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created CheckList",
            body : createdCheckList
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateCheckListById = async(req, res) => {
    const {id} = req.params;
    const {id_rent, description, status} = req.body;
    try {
        const [updatedCheckList] = await CheckLists.update({id_rent, description, status}, {where : {id_checklist : id}});
        let isUpdated;
        updatedCheckList <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated CheckList",
            body : {
                affectedRows : updatedCheckList,
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

export const deleteCheckListById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedCheckList = await CheckLists.destroy({where : {id_checklist : id}});
        let isDeleted;
        deletedCheckList <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedCheckList,
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