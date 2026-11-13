const { Router } = require('express');
const { crearReporte } = require('../controllers/reporte.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// POST /api/reportes — requiere autenticación
router.post('/', authMiddleware, crearReporte);

module.exports = router;