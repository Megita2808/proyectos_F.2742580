import { Router } from "express";
import multer from "multer";
import { createVoucher, deleteVoucherById, getVoucherById, getVouchers, getVouchersByReservation, updateVouchersByReservations, uploadVouchers } from "../controllers/10_5_Vouchers.controller.js";
const router = Router();

router.get('/vouchers', [], createVoucher); // Obtener todo
router.get('/vouchers/:id', [], getVoucherById); // Obtener por Id (req.params)
router.get('/vouchers_reservation/:id', [], getVouchersByReservation) // Obtener por Reserva (req.params)
router.post('/vouchers', [], createVoucher); // Crear (req.body)
router.put('/vouchers_reservation/:id', [], updateVouchersByReservations); // Editar Comprobantes de la Reserva (req.params y req.body)
router.delete('/vouchers/:id', [], deleteVoucherById); // Eliminar (req.params)



//Funcionalidad de Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/utils/uploads');
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `${Date.now()}.${ext}`);
    },
});

const upload = multer({ storage });

router.post('/vouchers/upload', [], upload.single('file'), uploadVouchers)




export default router;