const { Router } = require('express');
const { listarEtiquetas } = require('../controllers/etiqueta.controller');

const router = Router();

// GET /api/etiquetas
router.get('/', listarEtiquetas);

module.exports = router;