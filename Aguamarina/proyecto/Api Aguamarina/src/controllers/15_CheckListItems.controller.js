import CheckListItems from '../models/15_CheckListItem.model.js';

export const getCheckListItems = async(req, res) => {
    const items = await CheckListItems.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : items
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getCheckListItemById = async(req, res) => {
    const {id} = req.params;
    try {
        const items = await CheckListItems.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : items
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getCheckListItemsByCheckList = async(req, res) => {
    const {id} = req.params;
    try {
        const itmes = await CheckListItems.findAll({where : {id_checklist : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : itmes
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createCheckListItem = async(req, res) => {
    const {id_checklist, name_product, total_quantity, bad_quantity} = req.body;
    try {
        const createdItem = await CheckListItems.create({id_checklist, name_product, total_quantity, bad_quantity});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Item",
            body : createdItem
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateCheckListItemById = async(req, res) => {
    const {id} = req.params;
    const {id_checklist, name_product, total_quantity, bad_quantity} = req.body;
    try {
        const [updatedItem] = await CheckListItems.update({id_checklist, name_product, total_quantity, bad_quantity}, {where : {id_checklistitem : id}});
        let isUpdated;
        updatedItem <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Item",
            body : {
                affectedRows : updatedItem,
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

export const deleteCheckListItemById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedItem = await CheckListItems.destroy({where : {id_checklistitem : id}});
        let isDeleted;
        deletedItem <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedItem,
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