import Purchases from '../models/16_Purchase.model.js';
import User from '../models/18_User.model.js';
import Product from '../models/7_Product.model.js';

export const getPurchases = async(req, res) => {
    const purchases = await Purchases.findAll();
    const users = await User.findAll();
    const products = await Product.findAll();
    purchases.map((purch) => {
        const user = users.find((u) => u.id_user === purch.id_user);
        const product = products.find((p) => p.id_product === purch.id_product);
        purch.setDataValue('product', product ? product.name : null);
        purch.setDataValue('name_user', user ? `${user.names} ${user.lastnames}` : null);
    });
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : purchases
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
}

export const getPurchaseById = async(req, res) => {
    const {id} = req.params;
    try {
        const purchases = await Purchases.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : purchases
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getPurchasesByUser = async(req, res) => {
    const {id} = req.params;
    try {
        const purchases = await Purchases.findAll({where : {id_user : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : purchases
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getPurchasesByProduct = async(req, res) => {
    const {id} = req.params;
    try {
        const purchases = await Purchases.findAll({where : {id_product : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : purchases
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createPurchase = async(req, res) => {
    const {id_product, id_user, purchase_date, quantity, unit_price} = req.body;
    const total_price = quantity * unit_price;
    try {
        const product = await Product.findByPk(id_product);
        if (product) {
            const createdPurchase = await Purchases.create({id_product, id_user, purchase_date, quantity, unit_price, total_price, status: true});
            
            product.total_quantity += parseInt(quantity);
            await product.save();

            res.status(201).json({
                ok : true,
                status : 201,
                message : "Created Purchase",
                body : createdPurchase
            });
            return;
        }
        

        res.status(400).json({
            ok : false,
            status : 400,
            message : "No se ha encontrado un producto con ese ID para comprarlo",
            body : []
        });
        
        
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const denyPurchaseById = async(req, res) => {
    const {id} = req.params;
    try {
        const purchase = await Purchases.findByPk(id);

        if (purchase.status == false) {
            res.status(400).json({
                ok : false,
                status : 400,
                message : "Esta compra ya se encuentra denegada",
                body : {
                    purchase,
                    isDennied : false
                }
            });
            return;
        }

        const product = await Product.findByPk(purchase.id_product);
        purchase.status = false;
        await purchase.save();
        product.total_quantity -= parseInt(purchase.quantity);
        await product.save();
        let isDennied = true

        res.status(201).json({
            ok : true,
            status : 201,
            message : "Compra denegada correctamente",
            body : {
                purchase,
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