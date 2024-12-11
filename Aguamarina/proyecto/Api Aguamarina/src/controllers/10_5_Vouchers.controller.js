import fs from 'fs';
import cloudinary from '../utils/cloudinary.js';
import Voucher from '../models/10_5_Voucher.model.js';

export const getVouchers = async(req, res) => {
    const vouchers = await Voucher.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : vouchers
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getVoucherById = async(req, res) => {
    const {id} = req.params;
    try {
        const vouchers = await Voucher.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : vouchers
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getVouchersByReservation = async(req, res) => {
    const {id} = req.params;
    try {
        const vouchers = await Voucher.findAll({where : {id_reservation : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : vouchers
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};

export const createVoucher = async (req, res) => {
    const arrayVouchers = req.body;
    try {
        const createdVouchers = await Promise.all(
            arrayVouchers.map(async (voucher) => {
                const { id_reservation, path_image } = voucher;
                return await Voucher.create({ id_reservation, path_image });
            })
        );

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Vouchers created",
            body: createdVouchers
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Error al crear los comprobnates",
            err
        });
    }
};


export const updateVouchersByReservations = async(req, res) => {
    const {id} = req.params;
    const {arrayVouchers} = req.body;
    console.log(arrayVouchers);
    try {
        await Voucher.destroy({where : {id_reservation : id}});

        const updatedVouchers = await Promise.all(
            arrayVouchers.map(async (voucher) => {
                const path_image = voucher;
                await Voucher.create({ id_reservation: id, path_image });
            })
        );

        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Vouchers By Reservations",
            body : {
                updatedVouchers
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

export const deleteVoucherById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedVoucher = await Voucher.destroy({where : {id_voucher : id}});
        let isDeleted;
        deletedVoucher <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedVoucher,
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

export const uploadVouchers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: 'No file uploaded',
      });
    }

    const voucherPath = req.file.path;

    cloudinary.uploader.upload(voucherPath, function (err, result) {
      fs.unlinkSync(voucherPath);

      if (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({
          ok: false,
          status: 500,
          message: 'Error al subir a Cloudinary',
          error: err.message,
        });
      }

      res.status(200).json({
        ok: true,
        status: 201,
        message: 'Uploaded Voucher',
        body: result.secure_url,
      });
    });
  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: 'Error al procesar el Voucher',
      error: err.message,
    });
  }
};