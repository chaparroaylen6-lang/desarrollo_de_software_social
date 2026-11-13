const { Router } = require('express');
const {
  listarNotificaciones,
  marcarComoLeida,
} = require('../controllers/notificacion.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// GET   /api/notificaciones — requiere autenticación
router.get('/', authMiddleware, listarNotificaciones);

// PATCH /api/notificaciones/:id/leer — requiere autenticación
router.patch('/:id/leer', authMiddleware, marcarComoLeida);

module.exports = router;