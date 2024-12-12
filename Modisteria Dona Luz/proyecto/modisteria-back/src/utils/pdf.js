const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, file);
  },

  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },

  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },

  onError: function (err, next) {
    console.log("error", err);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb("Solo se permiten archivos PDF", false);
  }
};

const upload = multer({ storage, fileFilter });

const gestionPDF = async (req, res, next) => {
  if (req.file) {
    try {
      const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataURL, {
        resource_type: "raw",
        public_id: `${req.file.originalname}`,
        folder: "modisteria"
      });
      console.log(result);

      req.fileUrl = result.secure_url;
      next();
    } catch (error) {
      console.error("Error al subir archivo a Cloudinary:", error);
      res.status(500).send({ data: "Error al subir archivo a Cloudinary" });
    }
  } else {
    next();
  }
};



module.exports = { upload, gestionPDF };