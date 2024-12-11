import PaymentRegisters from '../models/13_PaymentRegister.model.js';

export const getPaymentRegisters = async(req, res) => {
    const payments = await PaymentRegisters.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : payments
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getPaymentRegisterById = async(req, res) => {
    const {id} = req.params;
    try {
        const payments = await PaymentRegisters.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : payments
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getPaymentRegistersByRent = async(req, res) => {
    const {id} = req.params;
    try {
        const payments = await PaymentRegisters.findAll({where : {id_rent : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : payments
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createPaymentRegister = async(req, res) => {
    const {id_rent, amount, payment_date} = req.body;
    try {
        const createdPayment = await PaymentRegisters.create({id_rent, amount, payment_date});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Payment",
            body : createdPayment
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updatePaymentRegisterById = async(req, res) => {
    const {id} = req.params;
    const {id_rent, amount, payment_date} = req.body;
    try {
        const [updatedPayment] = await PaymentRegisters.update({id_rent, amount, payment_date}, {where : {id_paymentregister : id}});
        let isUpdated;
        updatedPayment <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Payment",
            body : {
                affectedRows : updatedPayment,
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

export const deletePaymentRegisterById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedPayment = await PaymentRegisters.destroy({where : {id_paymentregister : id}});
        let isDeleted;
        deletedPayment <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedPayment,
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