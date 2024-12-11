import fs from 'fs';
import cloudinary from '../utils/cloudinary.js';

import Images from '../models/8_Image.model.js'

export const getImages = async(req, res) => {
    const images = await Images.findAll();
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : images
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getImageById = async(req, res) => {
    const {id} = req.params;
    try {
        const images = await Images.findByPk(id);
        res.status(200).json({
            ok : true,
            status : 200,
            body : images
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getImagesByProduct = async(req, res) => {
    const {id} = req.params;
    try {
        const images = await Images.findAll({where : {id_product : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : images
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};

export const createImage = async (req, res) => {
    const arrayImages = req.body;
    try {
        const createdImages = await Promise.all(
            arrayImages.map(async (image) => {
                const { id_product, path_image } = image;
                return await Images.create({ id_product, path_image });
            })
        );

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Images created",
            body: createdImages
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Error al crear las imagenes",
            err
        });
    }
};


export const updateImagesByProduct = async(req, res) => {
    const {id} = req.params;
    const {arrayImages} = req.body;
    console.log(arrayImages);
    try {
        await Images.destroy({where : {id_product : id}});

        const updatedImages = await Promise.all(
            arrayImages.map(async (image) => {
                const path_image = image;
                await Images.create({ id_product: id, path_image });
            })
        );

        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Images By Product",
            body : {
                updatedImages
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

export const deleteImageById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedImage = await Images.destroy({where : {id_image : id}});
        let isDeleted;
        deletedImage <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedImage,
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

export const uploadImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: 'No file uploaded',
      });
    }

    const imagePath = req.file.path;

    cloudinary.uploader.upload(imagePath, function (err, result) {
      fs.unlinkSync(imagePath);

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
        message: 'Uploaded Image',
        body: result.secure_url,
      });
    });
  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: 'Error al procesar la imagen',
      error: err.message,
    });
  }
};