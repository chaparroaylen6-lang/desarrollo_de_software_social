const { Router } = require('express');
const { toggleSeguir } = require('../controllers/seguimiento.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// POST /api/usuarios/:id/seguimiento — requiere autenticación
router.post('/:id/seguimiento', authMiddleware, toggleSeguir);

module.exports = router;