import LossDetail from '../models/17_5_LossDetail.model.js';
import Losses from '../models/17_Loss.model.js';
import Product from '../models/7_Product.model.js';

export const getLosses = async(req, res) => {
    try {
        const losses = await Losses.findAll();
        await Promise.all(losses.map(async (loss) => {
            const lossDetails = await LossDetail.findAll({ where: { id_loss: loss.id_loss }});
            loss.setDataValue('lossDetails', lossDetails);
        }));

        res.status(200).json({
            ok : true,
            status : 200,
            body : losses
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
}

export const getLossById = async(req, res) => {
    const {id} = req.params;
    try {
        const losses = await Losses.findByPk(id);
        const lossDetails = await LossDetail.findAll({where : {id_loss : id}});
        losses.setDataValue('lossDetails', lossDetails);
        res.status(200).json({
            ok : true,
            status : 200,
            body : losses
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getLossesByUser = async(req, res) => {
    const {id} = req.params;
    try {
        const allLosses = await Losses.findAll({where : {id_user : id}});
        const losses = await Promise.all(allLosses.map(async (loss) => {
            const lossDetails = await LossDetail.findAll({ where: { id_loss: loss.id_loss }});
            loss.setDataValue('lossDetails', lossDetails);
            return lossDetails;
        }));
        res.status(200).json({
            ok : true,
            status : 200,
            body : losses
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getLossesByProduct = async(req, res) => {
    const {id} = req.params;
    try {
        const lossDetails = await LossDetail.findAll({ where: { id_product: id }});
        
        res.status(200).json({
            ok : true,
            status : 200,
            body : lossDetails
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createLoss = async(req, res) => {

    const {id_user, lossesList, observations, loss_date} = req.body; //{id_user, [{id_product, quantity}], observations, loss_date}

    try {

        const lossCreated = await Loss.create({
            id_user,
            loss_date,
            observations
        });

        const createdLossDetails = await Promise.all(lossesList.map(async(detail) =>{
            const dataDetail = {
                id_loss : lossCreated.id_loss,
                id_product : detail.id_product,
                quantity : detail.quantity
            };
            const createdDetail = await LossDetail.create(dataDetail);
            const product = await Product.findByPk(dataDetail.id_product);

            product.total_quantity -= parseInt(detail.quantity);
            await product.save();
            return createdDetail;
        }))
        
        lossCreated.setDataValue('lossDetails', createdLossDetails);

        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Loss",
            body : lossCreated
        });
        return;
        
        
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const denyLossById = async(req, res) => {
    const {id} = req.params;
    let isDennied = true
    try {
        const loss = await Losses.findByPk(id);
        const lossDetails = await LossDetail.findAll({where: {id_loss : id}});

        if (loss.status == false) {
            res.status(400).json({
                ok : false,
                status : 400,
                message : "Esta pérdida ya se encuentra denegada",
                body : {
                    loss,
                    isDennied : false
                }
            });
            return;
        } else {
            const denniedLoss = await Promise.all(lossDetails.map(async(detail) =>{
                const lossDetail = await LossDetail.findByPk(detail.id_loss);
                const product = await Product.findByPk(lossDetail.id_product);
    
                product.total_quantity += parseInt(lossDetail.quantity);
                await product.save();
                return lossDetail;
            }))
            loss.setDataValue('lossDetails', denniedLoss);
            await Losses.update({status : false},{where: {id_loss: id}})
        }
        

        res.status(201).json({
            ok : true,
            status : 201,
            message : "Pérdida denegada correctamente",
            body : {
                loss,
                isDennied
            }
        });
    }  catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err : err.message
        });
    };
};