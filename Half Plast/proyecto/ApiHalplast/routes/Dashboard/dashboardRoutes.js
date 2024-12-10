const express = require('express');
const router = express.Router();
const {
  VentasPorCategoriaGet,
} = require('../../controllers/dashboard/dashboardController');

router.get('/dashboardDatos', VentasPorCategoriaGet);

module.exports = router; 
