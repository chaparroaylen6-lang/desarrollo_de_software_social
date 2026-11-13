const { Router } = require('express');
const {
  obtenerPerfilPropio,
  obtenerPerfilPorUsername,
  actualizarPerfil,
} = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');
const { actualizarPerfilSchema } = require('../validators/usuario.validator');

const router = Router();

// GET   /api/usuarios/yo — requiere autenticación (va ANTES de /:username)
router.get('/yo', authMiddleware, obtenerPerfilPropio);

// PATCH /api/usuarios/yo — requiere autenticación
router.patch('/yo', authMiddleware, validar(actualizarPerfilSchema), actualizarPerfil);

// GET   /api/usuarios/:username — público
router.get('/:username', obtenerPerfilPorUsername);

module.exports = router;